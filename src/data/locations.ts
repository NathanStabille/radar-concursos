export const stateNames = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

type StateCode = keyof typeof stateNames;

export type WorkLocation = {
  state: StateCode;
  municipality?: { id: number; name: string };
  tentative?: true;
  reserveOnly?: true;
};

// Códigos de municípios e localidades equivalentes da API de Localidades do IBGE.
export const municipalities = {
  rio: { state: "RJ", municipality: { id: 3304557, name: "Rio de Janeiro" } },
  seropedica: {
    state: "RJ",
    municipality: { id: 3305554, name: "Seropédica" },
  },
  novaIguacu: {
    state: "RJ",
    municipality: { id: 3303500, name: "Nova Iguaçu" },
  },
  tresRios: { state: "RJ", municipality: { id: 3306008, name: "Três Rios" } },
  campos: {
    state: "RJ",
    municipality: { id: 3301009, name: "Campos dos Goytacazes" },
  },
  brasilia: { state: "DF", municipality: { id: 5300108, name: "Brasília" } },
  saoPaulo: { state: "SP", municipality: { id: 3550308, name: "São Paulo" } },
  praiaGrande: {
    state: "SP",
    municipality: { id: 3541000, name: "Praia Grande" },
  },
  fortaleza: { state: "CE", municipality: { id: 2304400, name: "Fortaleza" } },
  joaoPessoa: {
    state: "PB",
    municipality: { id: 2507507, name: "João Pessoa" },
  },
  natal: { state: "RN", municipality: { id: 2408102, name: "Natal" } },
  florianopolis: {
    state: "SC",
    municipality: { id: 4205407, name: "Florianópolis" },
  },
} satisfies Record<string, WorkLocation>;
