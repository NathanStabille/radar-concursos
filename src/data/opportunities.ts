import { municipalities, type WorkLocation } from "./locations";
import { getNotice, type NoticeId } from "./notices";

export const reviewDate = "10/11/2026";

type OpportunityEntry = {
  id: string;
  noticeId: NoticeId;
  role: string;
  kind: "Concurso público" | "Seleção simplificada";
  professionalArea: string;
  specialty: string;
  locations: WorkLocation[];
  examLocation?: string;
  salary: number | null;
  salaryLabel: string;
  board: string;
  requirement: string;
  eligibility: string;
  start?: string;
  startHour?: string;
  end?: string;
  endHour?: string;
  stage: "ongoing" | "closed" | "finished";
  note?: string;
};

export type Opportunity = OpportunityEntry & { org: string };

const capitalLocation = [municipalities.rio];
const ruralLocations = [
  municipalities.seropedica,
  municipalities.novaIguacu,
  municipalities.tresRios,
  municipalities.campos,
].map((location): WorkLocation => ({ ...location, tentative: true }));
const dataprevLocations = [
  municipalities.brasilia,
  municipalities.rio,
  municipalities.saoPaulo,
  municipalities.fortaleza,
  municipalities.joaoPessoa,
  municipalities.natal,
  municipalities.florianopolis,
];
const publicExam = "Concurso público" as const;
const inProgress = "ongoing" as const;
const technology = "Tecnologia da Informação";
const explicit = "ADS citado no edital";
const technologist = "Tecnólogo em TI aceito";
const technologyDegree =
  "Diploma registrado de bacharelado ou tecnólogo em TI, de instituição credenciada pelo MEC, conforme o Anexo II.";
const cremerjBase = {
  noticeId: "cremerj-01-2026" as const,
  kind: publicExam,
  locations: capitalLocation,
  examLocation: "Rio de Janeiro, Campos dos Goytacazes ou Volta Redonda (RJ).",
  salary: 7765.48,
  salaryLabel: "Salário inicial · 40 h/semana",
  board: "Instituto Consulplan",
  start: "2026-09-23",
  startHour: "16:00",
  end: "2026-11-06",
  endHour: "16:00",
  stage: inProgress,
};

const cremerjTechnology = {
  ...cremerjBase,
  professionalArea: technology,
  requirement:
    "Diploma de bacharelado ou curso superior de tecnologia na área de TI, reconhecido pelo MEC, conforme a Retificação II do Edital nº 1/2026.",
  eligibility: technologist,
};

const ruralBase = {
  noticeId: "ufrrj-52-2026" as const,
  kind: publicExam,
  locations: ruralLocations,
  examLocation: "Campus da UFRRJ em Seropédica (RJ).",
  salary: 5215.39,
  board: "Comissão da UFRRJ",
  start: "2026-08-19",
  end: "2026-09-17",
  stage: inProgress,
  note: "Município de lotação ainda não confirmado. O edital lista Seropédica, Nova Iguaçu, Três Rios e Campos dos Goytacazes como possibilidades, a critério da UFRRJ.",
};

const ruralTechnology = {
  ...ruralBase,
  professionalArea: technology,
  salaryLabel: "Vencimento-base · 40 h/semana",
  requirement:
    "Curso superior na área, segundo o Quadro 1 do Edital nº 52/2026. ADS é formação superior na área de TI. O edital usa uma categoria ampla, sem enumerar cursos.",
  eligibility: "Superior na área de TI",
};

const dataprevBase = {
  professionalArea: technology,
  noticeId: "dataprev-2026" as const,
  kind: publicExam,
  examLocation: "Capitais brasileiras, conforme a opção na inscrição.",
  salary: 10685.44,
  salaryLabel: "Salário nominal + adicional de atividade",
  board: "FGV Conhecimento",
  requirement: technologyDegree,
  eligibility: technologist,
  start: "2026-07-06",
  startHour: "16:00",
  end: "2026-08-06",
  endHour: "16:00",
  stage: inProgress,
};

const tribunalBase = {
  professionalArea: technology,
  noticeId: "tjrj-01-2025" as const,
  kind: publicExam,
  locations: [{ state: "RJ" }] satisfies WorkLocation[],
  examLocation: "Rio de Janeiro (RJ).",
  note: "O cadastro de reserva destina-se à 1ª Região do TJRJ. O município da prova não confirma a lotação.",
  salary: 9363.84,
  salaryLabel: "Remuneração inicial do edital",
  board: "FGV Conhecimento",
  requirement:
    "Diploma registrado em ADS ou outra graduação prevista para a especialidade no Anexo II. O item 3.8.3 aceita curso superior de tecnologia. Cadastro de reserva para a 1ª Região.",
  eligibility: explicit,
  start: "2025-10-29",
  startHour: "16:00",
  end: "2025-11-27",
  endHour: "16:00",
  stage: "finished" as const,
};

const entries: OpportunityEntry[] = [
  {
    id: "fiotec-bio",
    noticeId: "fiotec-bio-004-fio-25" as const,
    role: "Analista de Desenvolvimento de Sistemas",
    kind: "Seleção simplificada",
    professionalArea: technology,
    specialty: "Desenvolvimento",
    locations: capitalLocation,
    salary: 9637.47,
    salaryLabel: "Salário mensal · 40 h/semana",
    board: "Fiotec",
    requirement:
      "Graduação completa em ADS ou em outra área indicada no anúncio. Exige experiência com .NET e C# MVC, aplicações web, SQL Server, IIS e outras competências descritas na chamada. CLT por prazo determinado.",
    eligibility: "ADS citado na chamada",
    end: "2026-11-07",
    stage: "closed",
    note: "A chamada confirma o prazo final, mas não indica expressamente o dia de abertura das inscrições.",
  },
  {
    ...cremerjTechnology,
    id: "cremerj-dev",
    role: "Analista de Desenvolvimento de Sistemas",
    specialty: "Desenvolvimento",
  },
  {
    ...cremerjTechnology,
    id: "cremerj-dba",
    role: "Analista de Banco de Dados (DBA)",
    specialty: "Dados",
  },
  {
    ...cremerjTechnology,
    id: "cremerj-ciencia-dados",
    role: "Analista de Ciência e Análise de Dados",
    specialty: "Dados",
  },
  {
    ...cremerjTechnology,
    id: "cremerj-suporte",
    role: "Analista de Suporte",
    specialty: "Infraestrutura e suporte",
  },
  {
    ...cremerjBase,
    id: "cremerj-contador",
    role: "Contador",
    professionalArea: "Contabilidade",
    specialty: "Ciências Contábeis",
    requirement:
      "Graduação completa em Ciências Contábeis e habilitação profissional ativa e válida no Conselho Regional de Contabilidade (CRC).",
    eligibility: "Graduação em Ciências Contábeis e CRC",
  },
  {
    id: "seplag-apo-ti",
    noticeId: "seplag-rj-2026" as const,
    role: "Analista de Planejamento e Orçamento · TI",
    kind: publicExam,
    professionalArea: technology,
    specialty: "Gestão de TI",
    locations: [{ state: "RJ" }],
    examLocation: "Rio de Janeiro (RJ).",
    salary: 7572.5,
    salaryLabel: "Vencimento-base · 40 h/semana",
    board: "FGV Conhecimento",
    requirement:
      "Diploma registrado de graduação de nível superior em qualquer área, fornecido por instituição reconhecida pelo MEC. O tecnólogo em ADS se enquadra nesse requisito.",
    eligibility: "Graduação em qualquer área",
    start: "2026-09-10",
    startHour: "16:00",
    end: "2026-10-08",
    endHour: "16:00",
    stage: inProgress,
    note: "Município de lotação não confirmado. A cidade indicada para a prova não comprova o local de trabalho.",
  },
  {
    ...ruralTechnology,
    id: "ufrrj-sistemas",
    role: "Analista de TI · Sistemas",
    specialty: "Desenvolvimento",
  },
  {
    ...ruralTechnology,
    id: "ufrrj-infra",
    role: "Analista de TI · Infraestrutura",
    specialty: "Infraestrutura e suporte",
  },
  {
    ...ruralBase,
    id: "ufrrj-fonoaudiologo",
    role: "Fonoaudiólogo",
    professionalArea: "Saúde",
    specialty: "Fonoaudiologia",
    salaryLabel: "Vencimento-base · 30 h/semana",
    requirement:
      "Curso superior em Fonoaudiologia e registro no conselho profissional competente, conforme o Anexo I.",
    eligibility: "Graduação em Fonoaudiologia e registro profissional",
  },
  {
    ...dataprevBase,
    id: "dataprev-dev",
    locations: dataprevLocations.map((location) => ({
      ...location,
      reserveOnly: ["DF", "RJ", "SP"].includes(location.state)
        ? true
        : undefined,
    })),
    role: "Analista de TI · Desenvolvimento de Software",
    specialty: "Desenvolvimento",
  },
  {
    ...dataprevBase,
    id: "dataprev-negocio",
    locations: dataprevLocations.map((location) => ({
      ...location,
      reserveOnly: location.state !== "DF" ? true : undefined,
    })),
    role: "Analista de TI · Análise de Negócio de TI",
    specialty: "Gestão de TI",
  },
  {
    ...dataprevBase,
    id: "dataprev-seg",
    locations: dataprevLocations.map((location) => ({
      ...location,
      reserveOnly: ["CE", "PB", "RN"].includes(location.state)
        ? true
        : undefined,
    })),
    role: "Analista de TI · Segurança Cibernética e Proteção de Dados",
    specialty: "Segurança da informação",
  },
  {
    ...tribunalBase,
    id: "tjrj-sistemas",
    role: "Analista Judiciário · Analista de Sistemas",
    specialty: "Desenvolvimento",
  },
  {
    ...tribunalBase,
    id: "tjrj-seguranca",
    role: "Analista Judiciário · Segurança da Informação",
    specialty: "Segurança da informação",
  },
  {
    id: "praia-grande-medico-trabalho",
    noticeId: "praia-grande-001-2026",
    role: "Médico Mensalista do Trabalho",
    kind: publicExam,
    professionalArea: "Saúde",
    specialty: "Medicina do Trabalho",
    locations: [municipalities.praiaGrande],
    salary: 5773.44,
    salaryLabel: "Vencimento-base · 20 h/semana",
    board: "IBAM",
    requirement:
      "Graduação em Medicina, registro no CRM e certificado de residência médica ou Registro de Qualificação de Especialista no CREMESP, conforme o edital.",
    eligibility: "Graduação em Medicina e registro profissional",
    start: "2026-04-25",
    end: "2026-05-20",
    stage: "finished",
  },
];

export const opportunities: Opportunity[] = entries.map((item) => ({
  ...item,
  org: getNotice(item.noticeId).org,
}));
