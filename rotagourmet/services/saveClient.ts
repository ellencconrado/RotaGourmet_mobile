// services/saveClient.ts
import { db, auth } from "@/lib/firebase";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";

const onlyDigits = (s: string) => String(s ?? "").replace(/\D+/g, "");
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v)).trim();

/** Remove chaves com '' (string vazia) para não poluir o doc */
function compactObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Record<string, any> = {};
  Object.keys(obj).forEach((k) => {
    const v = (obj as any)[k];
    if (v === "" || v === undefined) return; // ignora vazios/undefined
    out[k] = v;
  });
  return out as Partial<T>;
}

export type ClientePayload = {
  nome: string;
  telefone: string;
  cpf: string;

  cep: string;
  endereco: string;
  bairro: string;
  numero: string | number;
  uf: string;
  municipio: string;

  prefs: string[];
  alergias?: string | null;
};

export async function saveClient(p: ClientePayload) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");

  // normalização/validação mínima
  const nome = str(p.nome);
  const tel = onlyDigits(p.telefone);
  const cpf = onlyDigits(p.cpf);
  const cep = onlyDigits(p.cep);
  const numero = str(p.numero);

  if (!nome) throw new Error("Nome é obrigatório.");
  if (cpf.length !== 11) throw new Error("CPF inválido.");
  if (cep.length !== 8) throw new Error("CEP inválido.");
  if (!str(p.uf) || !str(p.municipio)) {
    throw new Error("UF e município são obrigatórios.");
  }

  const now = serverTimestamp();

  // Monta endereço sem undefined / strings vazias
  const endereco = compactObject({
    cep,
    logradouro: str(p.endereco),
    bairro: str(p.bairro),
    numero,
    municipio: str(p.municipio),
    uf: str(p.uf),
  });

  const publicDoc = compactObject({
    type: "cliente",
    nome,
    nomeLower: nome.toLowerCase(),
    tel,
    endereco,
    prefs: Array.isArray(p.prefs) ? p.prefs.filter(Boolean) : [],
    alergias: str(p.alergias) || null,
    createdAt: now,
    updatedAt: now,
  });

  const privateDoc = compactObject({
    cpf, // apenas dígitos
    createdAt: now,
    updatedAt: now,
  });

  const batch = writeBatch(db);
  batch.set(doc(db, "users", uid), publicDoc, { merge: true });
  batch.set(doc(db, "users_private", uid), privateDoc, { merge: true });

  // debug local – ajuda a identificar algum campo inesperado
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[saveClient] payload normalizado", { publicDoc, privateDoc });
  }

  await batch.commit();
}
