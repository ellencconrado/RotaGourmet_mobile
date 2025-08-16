// functions/src/index.ts
import type {Request, Response} from "express";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, Timestamp, getFirestore} from "firebase-admin/firestore";
import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";

initializeApp();
const db = getFirestore();

// região padrão (equivalente a functions.region do v1)
setGlobalOptions({region: "us-central1"});

/**
 * Middleware simples para aplicar CORS às rotas.
 * @param {function(Request,Response):
 * Promise<void>|void} handler Função de rota.
 * @return {function(Request,Response):Promise<void>} Função com suporte a CORS.
 */
function withCors(
  handler: (req: Request, res: Response) => Promise<void> | void,
) {
  return async (req: Request, res: Response): Promise<void> => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods"
      , "GET, POST, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    await handler(req, res);
  };
}

type Restaurant = {
  nome: string;
  cnpj?: string | null;
  tipoCulinaria?: string | null;
  faixaPreco?: string | number | null;
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
};

/** Cria restaurante (POST). */
export const createRestaurant = onRequest(
  withCors(async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.method !== "POST") {
        res.status(405).send({error: "Use POST"});
        return;
      }

      const {nome, cnpj, tipoCulinaria, faixaPreco} =
        (req.body ?? {}) as Partial<Restaurant>;

      if (!nome || typeof nome !== "string") {
        res.status(400).send({error: "nome é obrigatório (string)"});
        return;
      }

      const doc = await db.collection("restaurants").add({
        nome,
        cnpj: cnpj ?? null,
        tipoCulinaria: tipoCulinaria ?? null,
        faixaPreco: faixaPreco ?? null,
        createdAt: FieldValue.serverTimestamp(),
      } as Restaurant);

      res.status(201).send({id: doc.id});
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).send({error: message});
    }
  }),
);

/** Lista restaurantes (GET). */
export const listRestaurants = onRequest(
  withCors(async (_req: Request, res: Response): Promise<void> => {
    try {
      const snap = await db
        .collection("restaurants")
        .orderBy("createdAt", "desc")
        .get();

      const items = snap.docs.map((d) => ({id: d.id, ...d.data()}));
      res.status(200).send(items);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).send({error: message});
    }
  }),
);

/** Obtém restaurante por id (GET ?id=...). */
export const getRestaurant = onRequest(
  withCors(async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req.query.id as string) ?? "";
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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).send({error: message});
    }
  }),
);

/** Atualiza restaurante (PATCH ?id=...). */
export const updateRestaurant = onRequest(
  withCors(async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.method !== "PATCH") {
        res.status(405).send({error: "Use PATCH"});
        return;
      }

      const id = (req.query.id as string) ?? "";
      if (!id) {
        res.status(400).send({error: "param id é obrigatório"});
        return;
      }

      const data = req.body as Partial<Restaurant>;
      if (!data || typeof data !== "object") {
        res.status(400).send({error: "body inválido"});
        return;
      }

      const updates: Partial<Restaurant> = {
        ...("nome" in data ? {nome: data.nome as string} : {}),
        ...("cnpj" in data ? {cnpj: data.cnpj ?? null} : {}),
        ...("tipoCulinaria" in data ? {tipoCulinaria:
          data.tipoCulinaria ?? null} : {}),
        ...("faixaPreco" in data ? {faixaPreco: data.faixaPreco ?? null} : {}),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await db.collection("restaurants").doc(id).update(updates);
      res.status(204).send("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).send({error: message});
    }
  }),
);

/** Remove restaurante (DELETE ?id=...). */
export const deleteRestaurant = onRequest(
  withCors(async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.method !== "DELETE") {
        res.status(405).send({error: "Use DELETE"});
        return;
      }

      const id = (req.query.id as string) ?? "";
      if (!id) {
        res.status(400).send({error: "param id é obrigatório"});
        return;
      }

      await db.collection("restaurants").doc(id).delete();
      res.status(204).send("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).send({error: message});
    }
  }),
);
