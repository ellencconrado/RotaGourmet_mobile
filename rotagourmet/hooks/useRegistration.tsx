import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UserType = "client" | "restaurant" | null;

export type Address = {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
};

export type ClientBasics = {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: Address;
};

export type ClientPrefs = {
  preferencias: string[];
  alergiasObs: string;
};

// ---------- Restaurante (NOVO) ----------
export type RestaurantBasics = {
  nome: string;
  cnpj: string;
  telefone: string;
  endereco: Address;
};

export type RestaurantDetails = {
  logoUri: string | null;
  descricao: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  cuisines: string[]; // ids
};

export type RestaurantOperational = {
  reserva: boolean;
  fila: boolean;
  filas: { nome: string; ativo: boolean }[];
  diasFuncionamento: Record<string, boolean>; // dom..sab
  //horarioAbertura: string; // "08:00"
  //horarioFechamento: string; // "22:00"
  horarios: Record<string, { abertura: string; fechamento: string }>;
  cardapioUri: string | null;
  cardapioNome: string;
  precoMinimo: number;
  precoMaximo: number;
};
// ----------------------------------------

type RegistrationContextValue = {
  userType: UserType;
  setUserType: (t: UserType) => void;

  clientBasics: ClientBasics;
  setClientBasics: (patch: Partial<ClientBasics>) => void;

  clientPrefs: ClientPrefs;
  setClientPrefs: (patch: Partial<ClientPrefs>) => void;

  // Restaurante (NOVO)
  restaurantBasics: RestaurantBasics;
  setRestaurantBasics: (patch: Partial<RestaurantBasics>) => void;

  restaurantDetails: RestaurantDetails;
  setRestaurantDetails: (patch: Partial<RestaurantDetails>) => void;

  restaurantOperational: RestaurantOperational;
  setRestaurantOperational: (patch: Partial<RestaurantOperational>) => void;

  reset: () => void;
};

const initialAddress: Address = {
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  municipio: "",
  uf: "",
};

const initialBasics: ClientBasics = {
  nome: "",
  cpf: "",
  telefone: "",
  endereco: initialAddress,
};

const initialPrefs: ClientPrefs = {
  preferencias: [],
  alergiasObs: "",
};

// Restaurante (iniciais)
const initialRestaurantBasics: RestaurantBasics = {
  nome: "",
  cnpj: "",
  telefone: "",
  endereco: initialAddress,
};

const initialRestaurantDetails: RestaurantDetails = {
  logoUri: null,
  descricao: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
  cuisines: [],
};
const diasMap = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

const horariosIniciais = Object.fromEntries(
  diasMap.map(dia => [dia, { abertura: "08:00", fechamento: "22:00" }])
);

const initialRestaurantOperational: RestaurantOperational = {
  reserva: false,
  fila: false,
  filas: [],
 // diasFuncionamento: {
 //   dom: false,
 //   seg: false,
 //   ter: false,
 //   qua: false,
 //   qui: false,
 //   sex: false,
 //   sab: false,
 // },  
  //horarioAbertura: "08:00",
  //horarioFechamento: "22:00",
  //diasFuncionamento: diasMap.reduce((acc, dia) => ({ ...acc, [dia]: false }), {} as Record<string, boolean>),
  //horarios: horariosIniciais,
  diasFuncionamento: Object.fromEntries(diasMap.map(d => [d, false])),
  horarios: { ...horariosIniciais },
  cardapioUri: null,
  cardapioNome: "",
  precoMinimo: 0,
  precoMaximo: 0,
};

const RegistrationContext = createContext<RegistrationContextValue | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);

  const [clientBasics, setClientBasicsState] =
    useState<ClientBasics>(initialBasics);
  const [clientPrefs, setClientPrefsState] =
    useState<ClientPrefs>(initialPrefs);

  const [restaurantBasics, setRestaurantBasicsState] =
    useState<RestaurantBasics>(initialRestaurantBasics);
  const [restaurantDetails, setRestaurantDetailsState] =
    useState<RestaurantDetails>(initialRestaurantDetails);
  const [restaurantOperational, setRestaurantOperationalState] =
    useState<RestaurantOperational>(initialRestaurantOperational);

  const setClientBasics = (patch: Partial<ClientBasics>) => {
    setClientBasicsState((prev) => ({
      ...prev,
      ...patch,
      endereco: { ...prev.endereco, ...(patch.endereco ?? {}) },
    }));
  };

  const setClientPrefs = (patch: Partial<ClientPrefs>) => {
    setClientPrefsState((prev) => ({ ...prev, ...patch }));
  };

  const setRestaurantBasics = (patch: Partial<RestaurantBasics>) => {
    setRestaurantBasicsState((prev) => ({
      ...prev,
      ...patch,
      endereco: { ...prev.endereco, ...(patch.endereco ?? {}) },
    }));
  };

  const setRestaurantDetails = (patch: Partial<RestaurantDetails>) => {
    setRestaurantDetailsState((prev) => ({ ...prev, ...patch }));
  };

  const setRestaurantOperational = (patch: Partial<RestaurantOperational>) => {
    setRestaurantOperationalState((prev) => ({ ...prev, ...patch }));
  };

  const reset = () => {
    setUserType(null);
    setClientBasicsState(initialBasics);
    setClientPrefsState(initialPrefs);
    setRestaurantBasicsState(initialRestaurantBasics);
    setRestaurantDetailsState(initialRestaurantDetails);
    setRestaurantOperationalState(initialRestaurantOperational);
  };

  const value = useMemo<RegistrationContextValue>(
    () => ({
      userType,
      setUserType,
      clientBasics,
      setClientBasics,
      clientPrefs,
      setClientPrefs,

      restaurantBasics,
      setRestaurantBasics,
      restaurantDetails,
      setRestaurantDetails,
      restaurantOperational,
      setRestaurantOperational,

      reset,
    }),
    [
      userType,
      clientBasics,
      clientPrefs,
      restaurantBasics,
      restaurantDetails,
      restaurantOperational,
    ]
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error(
      "useRegistration deve ser usado dentro de <RegistrationProvider>"
    );
  return ctx;
}
