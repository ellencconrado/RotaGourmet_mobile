/* eslint-disable @typescript-eslint/no-explicit-any */
import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";

setGlobalOptions({region: "us-central1"});

initializeApp();
const db = getFirestore();

/*
 * Middleware CORS simples para rotas HTTP (onRequest).
 * @param {(req:any,res:any)=>Promise<void>|void} handler Função-alvo.
 * @return {(req:any,res:any)=>Promise<void>} Função com CORS.
 */
const withCors = (
  handler: (req: any, res: any) => Promise<void>|void,
) => {
  return async ( req: any, res: any) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    await handler(req, res);
  };
};

/**
 * Valida o Bearer token e retorna o payload do usuário.
 * @param {any} req Requisição HTTP.
 * @return {Promise<any>} Decodificação do ID token.
 */
async function requireAuth(req: any): Promise<any> {
  const header = req.headers?.authorization || "";
  if (!header.startsWith("Bearer ")) {
    const e: any = new Error("unauthenticated");
    e.code = 401;
    throw e;
  }
  const idToken = header.substring("Bearer ".length);
  try {
    return await getAuth().verifyIdToken(idToken);
  } catch (err) {
    const e: any = new Error("unauthenticated");
    e.code = 401;
    throw e;
  }
}
/**
 * Mantém apenas dígitos.
 * @param {string} s Texto de entrada.
 * @return {string} Somente dígitos.
 */
function onlyDigits(s: string): string {
  return String(s ?? "").replace(/\D+/g, "");
}

/**
 * Verifica formato HH:mm.
 * @param {string} s Texto da hora.
 * @return {boolean} true se válido.
 */
function isTime(s: string): boolean {
  return /^\d{2}:\d{2}$/.test(String(s ?? ""));
}

/**
 * Cria restaurante (POST).
 * Body esperado (pt-BR): {
 *  nome, cnpj, telefone, cep, endereco, bairro, numero, uf, municipio,
 *  reserva, fila, filas, diasFuncionamento, horarioAbertura,
 *  horarioFechamento, precoMinimo, precoMaximo, cardapio
 * }
 * @param {any} req Requisição.
 * @param {any} res Resposta.
 * @return {Promise<void>} Sem retorno (HTTP).
 */
export const createRestaurant = onRequest(
  withCors(async (req: any, res: any): Promise<void> => {
    try {
      if (req.method !== "POST") {
        res.status(405).send({error: "Use POST"});
        return;
      }
      const auth = await requireAuth(req);

      const b = req.body ?? {};
      const nome = b.nome;
      const cnpj = onlyDigits(b.cnpj);
      const telefone = b.telefone ? onlyDigits(b.telefone) : null;
      const cep = onlyDigits(b.cep);
      const endereco = b.endereco ?? "";
      const bairro = b.bairro ?? "";
      const numero = String(b.numero ?? "");
      const uf = b.uf;
      const municipio = b.municipio;

      const reserva = !!b.reserva;
      const fila = !!b.fila;
      const filas = Array.isArray(b.filas) ? b.filas : [];

      const dias = b.diasFuncionamento ?? {
        dom: false, seg: false, ter: false, qua: false,
        qui: false, sex: false, sab: false,
      };
      const abertura = b.horarioAbertura;
      const fechamento = b.horarioFechamento;

      const precoMin = Number(b.precoMinimo ?? 0);
      const precoMax = Number(b.precoMaximo ?? 0);

      const cardapio = b.cardapio ?? null; // {path,url} | null

      if (!nome || typeof nome !== "string") {
        res.status(400).send({error: "nome é obrigatório"});
        return;
      }
      if (cnpj.length !== 14) {
        res.status(400).send({error: "CNPJ inválido"});
        return;
      }
      if (!uf || !municipio) {
        res.status(400).send({error: "UF e município são obrigatórios"});
        return;
      }
      if (!isTime(abertura) || !isTime(fechamento)) {
        res.status(400).send({error: "horários devem ser HH:mm"});
        return;
      }
      if (precoMin > precoMax) {
        res.status(400).send({error: "faixa de preço inválida"});
        return;
      }

      const dup = await db.collection("restaurants")
        .where("cnpj", "==", cnpj)
        .limit(1)
        .get();
      if (!dup.empty) {
        res.status(409).send({error: "CNPJ já cadastrado"});
        return;
      }

      const doc = await db.collection("restaurants").add({
        donoUid: auth.uid,
        nome: nome,
        cnpj: cnpj,
        telefone: telefone,
        endereco: {
          cep: cep,
          logradouro: endereco,
          numero: numero,
          bairro: bairro,
          municipio: municipio,
          uf: uf,
        },
        servicos: {
          reserva: reserva,
          fila: fila,
          filas: filas,
        },
        horario: {
          abertura: abertura,
          fechamento: fechamento,
          dias: dias,
        },
        preco: {
          minimo: precoMin,
          maximo: precoMax,
        },
        cardapio: cardapio,
        avaliacaoMedia: 0,
        status: "ativo",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      res.status(201).send({id: doc.id});
    } catch (err: any) {
      const code = err?.code === 401 ? 401 : 500;
      const msg = err?.message || "erro interno";
      res.status(code).send({error: msg});
    }
  }),
);

/**
 * Lista restaurantes com filtros e paginação.
 * Query: uf, municipio, reserva, fila, q, limit,
 * cursorId (padrão) ou cursorNome (busca).
 * @param {any} req Requisição.
 * @param {any} res Resposta.
 * @return {Promise<void>} Sem retorno (HTTP).
 */
export const listRestaurants = onRequest(
  withCors(async (req: any, res: any): Promise<void> => {
    try {
      const uf = req.query.uf ? String(req.query.uf) : undefined;
      const municipio = req.query.municipio ?
        String(req.query.municipio) :
        undefined;

      const reserva = req.query.reserva === undefined ?
        undefined :
        String(req.query.reserva).toLowerCase() === "true";

      const fila = req.query.fila === undefined ?
        undefined :
        String(req.query.fila).toLowerCase() === "true";

      const q = req.query.q ? String(req.query.q).trim() : undefined;

      const limitRaw = Number(req.query.limit ?? 20);
      const limit = Math.max(
        1,
        Math.min(isFinite(limitRaw) ? limitRaw : 20, 50),
      );

      const cursorId = req.query.cursorId ?
        String(req.query.cursorId) :
        undefined;
      const cursorNome = req.query.cursorNome ?
        String(req.query.cursorNome) :
        undefined;

      let query: FirebaseFirestore.Query =
        db.collection("restaurants")
          .where("status", "==", "ativo");

      if (uf) query = query.where("endereco.uf", "==", uf);
      if (municipio) {
        query = query.where("endereco.municipio", "==", municipio);
      }
      if (reserva !== undefined) {
        query = query.where("servicos.reserva", "==", reserva);
      }
      if (fila !== undefined) {
        query = query.where("servicos.fila", "==", fila);
      }

      if (q) {
        query = query.orderBy("nome", "asc");
        query = query.startAt(q).endAt(q + "\uf8ff");
        if (cursorNome) query = query.startAfter(cursorNome);
        query = query.limit(limit);

        const snap = await query.get();
        const items = snap.docs.map((d) => ({id: d.id, ...d.data()}));
        const last = snap.docs[snap.docs.length - 1];
        const nextCursorNome = last ? String(last.get("nome") || "") : null;

        res.status(200).send({
          mode: "search",
          q: q,
          items: items,
          nextCursorNome: nextCursorNome,
          hasMore: !!nextCursorNome && snap.size === limit,
        });
        return;
      }

      query = query.orderBy("createdAt", "desc");
      if (cursorId) {
        const cursorDoc = await db.collection("restaurants")
          .doc(cursorId)
          .get();
        if (cursorDoc.exists) query = query.startAfter(cursorDoc);
      }
      query = query.limit(limit);

      const snap = await query.get();
      const items = snap.docs.map((d) => ({id: d.id, ...d.data()}));
      const last = snap.docs[snap.docs.length - 1];
      const nextCursorId = last ? last.id : null;

      res.status(200).send({
        mode: "default",
        items: items,
        nextCursorId: nextCursorId,
        hasMore: !!nextCursorId && snap.size === limit,
      });
    } catch (err: any) {
      const msg = err?.message || "erro interno";
      res.status(500).send({error: msg});
    }
  }),
);

/**
 * Obtém restaurante por id (?id=...).
 * @param {any} req Requisição.
 * @param {any} res Resposta.
 * @return {Promise<void>} Sem retorno (HTTP).
 */
export const getRestaurant = onRequest(
  withCors(async (req: any, res: any): Promise<void> => {
    try {
      const id = String(req.query.id ?? "");
      if (!id) {
        res.status(400).send({error: "param id é obrigatório"});
        return;
      }
      const doc = await db.collection("restaurants").doc(id).get();
      if (!doc.exists) {
        res.status(404).send({error: "não encontrado"});
        return;
      }
      res.status(200).send({id: doc.id, ...doc.data()});
    } catch (err: any) {
      const msg = err?.message || "erro interno";
      res.status(500).send({error: msg});
    }
  }),
);

/**
 * Atualiza restaurante (PATCH ?id=...).
 * @param {any} req Requisição.
 * @param {any} res Resposta.
 * @return {Promise<void>} Sem retorno (HTTP).
 */
export const updateRestaurant = onRequest(
  withCors(async (req: any, res: any): Promise<void> => {
    try {
      if (req.method !== "PATCH") {
        res.status(405).send({error: "Use PATCH"});
        return;
      }
      await requireAuth(req);

      const id = String(req.query.id ?? "");
      if (!id) {
        res.status(400).send({error: "param id é obrigatório"});
        return;
      }

      const data = req.body;
      if (!data || typeof data !== "object") {
        res.status(400).send({error: "body inválido"});
        return;
      }

      const updates: any = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if ("nome" in data) updates.nome = data.nome;
      if ("cnpj" in data) updates.cnpj = onlyDigits(data.cnpj);
      if ("telefone" in data) {
        updates.telefone = data.telefone ? onlyDigits(data.telefone) : null;
      }

      if ("endereco" in data && data.endereco) {
        const e = data.endereco;
        updates.endereco = {
          ...(e.cep !== undefined ? {cep: onlyDigits(e.cep)} : {}),
          ...(e.logradouro !== undefined ? {logradouro: e.logradouro} : {}),
          ...(e.numero !== undefined ? {numero: String(e.numero)} : {}),
          ...(e.bairro !== undefined ? {bairro: e.bairro} : {}),
          ...(e.municipio !== undefined ? {municipio: e.municipio} : {}),
          ...(e.uf !== undefined ? {uf: e.uf} : {}),
        };
      }

      if ("servicos" in data && data.servicos) {
        const s = data.servicos;
        updates.servicos = {
          ...(s.reserva !== undefined ? {reserva: !!s.reserva} : {}),
          ...(s.fila !== undefined ? {fila: !!s.fila} : {}),
          ...(Array.isArray(s.filas) ? {filas: s.filas} : {}),
        };
      }

      if ("horario" in data && data.horario) {
        const h = data.horario;
        if (h.abertura && !isTime(h.abertura)) {
          res.status(400).send({error: "horario.abertura inválido"});
          return;
        }
        if (h.fechamento && !isTime(h.fechamento)) {
          res.status(400).send({error: "horario.fechamento inválido"});
          return;
        }
        updates.horario = {
          ...(h.abertura !== undefined ? {abertura: h.abertura} : {}),
          ...(h.fechamento !== undefined ? {fechamento: h.fechamento} : {}),
          ...(h.dias !== undefined ? {dias: h.dias} : {}),
        };
      }

      if ("preco" in data && data.preco) {
        const p = data.preco;
        if (
          p.minimo !== undefined &&
          p.maximo !== undefined &&
          Number(p.minimo) > Number(p.maximo)
        ) {
          res.status(400).send({error: "preço mínimo > máximo"});
          return;
        }
        updates.preco = {
          ...(p.minimo !== undefined ? {minimo: Number(p.minimo)} : {}),
          ...(p.maximo !== undefined ? {maximo: Number(p.maximo)} : {}),
        };
      }

      if ("cardapio" in data) {
        updates.cardapio = data.cardapio ?? null;
      }

      await db.collection("restaurants").doc(id).update(updates);
      res.status(204).send("");
    } catch (err: any) {
      const code = err?.code === 401 ? 401 : 500;
      const msg = err?.message || "erro interno";
      res.status(code).send({error: msg});
    }
  }),
);

/**
 * Remove restaurante (DELETE ?id=...).
 * @param {any} req Requisição.
 * @param {any} res Resposta.
 * @return {Promise<void>} Sem retorno (HTTP).
 */
export const deleteRestaurant = onRequest(
  withCors(async (req: any, res: any): Promise<void> => {
    try {
      if (req.method !== "DELETE") {
        res.status(405).send({error: "Use DELETE"});
        return;
      }
      await requireAuth(req);

      const id = String(req.query.id ?? "");
      if (!id) {
        res.status(400).send({error: "param id é obrigatório"});
        return;
      }
      await db.collection("restaurants").doc(id).delete();
      res.status(204).send("");
    } catch (err: any) {
      const code = err?.code === 401 ? 401 : 500;
      const msg = err?.message || "erro interno";
      res.status(code).send({error: msg});
    }
  }),
);
