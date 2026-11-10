import { ioerjSearchUrl } from "./types";

export const sourceDirectory = {
  ioerj: {
    name: "Diário Oficial do RJ",
    scope: "Estadual · RJ",
    url: ioerjSearchUrl,
    selection: "Busca por “concurso público” no mês corrente.",
  },
  ufrrj: {
    name: "Universidade Federal Rural do Rio de Janeiro",
    scope: "Federal · UFRRJ",
    url: "https://servicos.ufrrj.br/concursos/?acao=concursos_andamento&tipo=3",
    selection:
      "Editais e mudanças de calendário dos concursos técnico-administrativos em andamento.",
  },
  praiaGrande: {
    name: "Prefeitura de Praia Grande",
    scope: "Municipal · SP",
    url: "https://www.praiagrande.sp.gov.br/administracao/concurso_publico.asp",
    selection: "Editais de abertura e retificações do ano corrente.",
  },
};

export type SourceId = keyof typeof sourceDirectory;

export const sourceIds = Object.keys(sourceDirectory) as SourceId[];

export type SourcePublication = { title: string; url: string; detail?: string };

export type SourceReading = {
  checkedAt: string;
  status: "available" | "unavailable";
  lastSuccessAt: string | null;
  publications: SourcePublication[];
};

export type SourceReport = {
  storage: "ready" | "unconfigured" | "unavailable";
  readings: Partial<Record<SourceId, SourceReading>>;
};
