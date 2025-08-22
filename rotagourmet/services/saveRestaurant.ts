// services/saveRestaurant.ts
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

/** Tenta deduzir a extensão a partir do nome/URI */
function guessExt(nameOrUri?: string | null) {
  if (!nameOrUri) return "";
  const m = nameOrUri.match(/\.(\w+)(?:\?|#|$)/i);
  return m ? `.${m[1].toLowerCase()}` : "";
}

/** Upload de arquivo (uri local do Expo) -> URL pública do Storage */
async function uploadFromUri(uri: string, path: string) {
  const res = await fetch(uri);
  const blob = await res.blob(); // Expo dá suporte a blob() para file:// e content://

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, {
    contentType: (blob as any)?.type || undefined, // tenta manter o mime
  });
  return await getDownloadURL(storageRef);
}

type SaveRestaurantInput = {
  basics: {
    nome: string;
    cnpj: string;
    telefone: string;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      bairro: string;
      municipio: string;
      uf: string;
    };
  };
  details: {
    logoUri: string | null;
    descricao: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    cuisines: string[]; // ids
  };
  operational: {
    reserva: boolean;
    fila: boolean;
    filas: { nome: string; ativo: boolean }[];
    diasFuncionamento: Record<string, boolean>;
    horarioAbertura: string;
    horarioFechamento: string;
    cardapioUri: string | null;
    cardapioNome: string;
    precoMinimo: number;
    precoMaximo: number;
  };
};

export async function saveRestaurant(input: SaveRestaurantInput) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");

  // 1) cria o doc para obter o ID
  const baseData = {
    ...input.basics,
    details: {
      descricao: input.details.descricao,
      instagram: input.details.instagram,
      facebook: input.details.facebook,
      whatsapp: input.details.whatsapp,
      cuisines: input.details.cuisines,
      logoUrl: null as string | null, // vamos preencher depois
    },
    operational: {
      reserva: input.operational.reserva,
      fila: input.operational.fila,
      filas: input.operational.filas,
      diasFuncionamento: input.operational.diasFuncionamento,
      horarioAbertura: input.operational.horarioAbertura,
      horarioFechamento: input.operational.horarioFechamento,
      cardapioUrl: null as string | null, // vamos preencher depois
      precoMinimo: input.operational.precoMinimo,
      precoMaximo: input.operational.precoMaximo,
    },
    donoUid: uid,
    status: "ativo",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "restaurants"), baseData);
  const id = docRef.id;

  // 2) faz upload(s) se tiver arquivo
  const updates: any = {};
  try {
    if (input.details.logoUri) {
      const ext = guessExt(input.details.logoUri) || ".jpg";
      const logoPath = `restaurants/${uid}/${id}/logo_${Date.now()}${ext}`;
      const logoUrl = await uploadFromUri(input.details.logoUri, logoPath);
      updates["details.logoUrl"] = logoUrl;
    }

    if (input.operational.cardapioUri) {
      const ext =
        guessExt(input.operational.cardapioNome) ||
        guessExt(input.operational.cardapioUri) ||
        ".pdf";
      const menuPath = `restaurants/${uid}/${id}/cardapio_${Date.now()}${ext}`;
      const cardapioUrl = await uploadFromUri(input.operational.cardapioUri, menuPath);
      updates["operational.cardapioUrl"] = cardapioUrl;
    }
  } catch (e) {
    // se upload falhar, mantém o doc sem URLs (pode atualizar depois)
    console.error("[saveRestaurant] upload error:", e);
    throw new Error("Falha ao enviar arquivos (logo/cardápio).");
  }

  // 3) atualiza o doc com as URLs
  if (Object.keys(updates).length) {
    await setDoc(doc(db, "restaurants", id), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
  }

  return id;
}
