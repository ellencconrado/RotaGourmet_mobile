import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UserType = "client" | "restaurant" | null;

export type ClientBasics = {
  nome: string;
  cpf: string;
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

export type ClientPrefs = {
  preferencias: string[];   // ids/nomes das cozinhas escolhidas
  alergiasObs: string;      // texto livre
};

type RegistrationContextValue = {
  userType: UserType;
  setUserType: (t: UserType) => void;

  clientBasics: ClientBasics;
  setClientBasics: (patch: Partial<ClientBasics>) => void;

  clientPrefs: ClientPrefs;
  setClientPrefs: (patch: Partial<ClientPrefs>) => void;

  reset: () => void;
};

const initialBasics: ClientBasics = {
  nome: "",
  cpf: "",
  telefone: "",
  endereco: {
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    municipio: "",
    uf: "",
  },
};

const initialPrefs: ClientPrefs = {
  preferencias: [],
  alergiasObs: "",
};

const RegistrationContext = createContext<RegistrationContextValue | undefined>(
  undefined,
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [clientBasics, setClientBasicsState] =
    useState<ClientBasics>(initialBasics);
  const [clientPrefs, setClientPrefsState] =
    useState<ClientPrefs>(initialPrefs);

  // Faz merge seguro (inclusive do objeto endereco)
  const setClientBasics = (patch: Partial<ClientBasics>) => {
    setClientBasicsState((prev) => ({
      ...prev,
      ...patch,
      endereco: {
        ...prev.endereco,
        ...(patch.endereco ?? {}),
      },
    }));
  };

  const setClientPrefs = (patch: Partial<ClientPrefs>) => {
    setClientPrefsState((prev) => ({ ...prev, ...patch }));
  };

  const reset = () => {
    setUserType(null);
    setClientBasicsState(initialBasics);
    setClientPrefsState(initialPrefs);
  };

  const value = useMemo<RegistrationContextValue>(
    () => ({
      userType,
      setUserType,
      clientBasics,
      setClientBasics,
      clientPrefs,
      setClientPrefs,
      reset,
    }),
    [userType, clientBasics, clientPrefs],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error(
      "useRegistration deve ser usado dentro de <RegistrationProvider>",
    );
  }
  return ctx;
}
