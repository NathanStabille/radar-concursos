import { municipalities, type WorkLocation } from "./locations";
import { getNotice, type NoticeId } from "./notices";
import type {
  Opportunity,
  OpportunityEntry as CatalogEntry,
} from "@/types/catalog";
export type { Opportunity } from "@/types/catalog";

export const reviewDate = "11/11/2026";
type OpportunityEntry = Omit<CatalogEntry, "noticeId"> & { noticeId: NoticeId };

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

const ruralTechnical = {
  ...ruralBase,
  noticeId: "ufrrj-53-2026" as const,
  salary: 3181.39,
  salaryLabel: "Vencimento-base · 40 h/semana",
  start: "2026-09-14",
  startHour: "10:00",
  end: "2026-10-13",
  endHour: "17:00",
};
const laboratoryRequirement =
  "Ensino médio profissionalizante ou ensino médio completo com curso técnico na área do cargo, conforme o Quadro 1 do edital.";

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
    ...cremerjBase,
    id: "cremerj-advogado",
    role: "Advogado",
    professionalArea: "Direito",
    specialty: "Advocacia",
    salary: 7718.45,
    salaryLabel: "Vencimento-base · 30 h/semana",
    requirement:
      "Bacharelado em Direito, OAB ativa e pelo menos um ano de experiência comprovada em advocacia.",
    eligibility: "Direito, OAB e experiência",
  },
  {
    ...cremerjBase,
    id: "cremerj-analista-contabil",
    role: "Analista Contábil",
    professionalArea: "Contabilidade",
    specialty: "Ciências Contábeis",
    locations: [{ ...municipalities.rio, reserveOnly: true }],
    salary: 6084.46,
    requirement: "Graduação em Ciências Contábeis e CRC ativo e válido.",
    eligibility: "Ciências Contábeis e CRC",
  },
  {
    ...cremerjBase,
    id: "cremerj-recursos-humanos",
    role: "Analista de Recursos Humanos",
    professionalArea: "Administração",
    specialty: "Recursos Humanos",
    salary: 6084.46,
    requirement:
      "Graduação em Administração, Psicologia, Gestão de Recursos Humanos ou Gestão de Pessoas, com registro ativo no conselho pertinente.",
    eligibility: "Superior nas formações previstas e registro profissional",
  },
  {
    ...cremerjBase,
    id: "cremerj-financeiro",
    role: "Analista Financeiro",
    professionalArea: "Administração",
    specialty: "Finanças",
    salary: 6084.46,
    requirement:
      "Bacharelado em Administração, Ciências Econômicas, Ciências Contábeis ou Direito.",
    eligibility: "Bacharelado nas formações previstas",
  },
  {
    ...cremerjBase,
    id: "cremerj-juridico",
    role: "Analista Jurídico",
    professionalArea: "Direito",
    specialty: "Análise jurídica",
    locations: [{ ...municipalities.rio, reserveOnly: true }],
    salary: 6084.46,
    requirement: "Bacharelado em Direito.",
    eligibility: "Bacharelado em Direito",
  },
  {
    ...cremerjBase,
    id: "cremerj-auditor",
    role: "Auditor",
    professionalArea: "Contabilidade",
    specialty: "Auditoria",
    salary: 18000,
    requirement:
      "Bacharelado em Ciências Contábeis, Administração, Direito, Economia ou Engenharia.",
    eligibility: "Bacharelado nas formações previstas",
  },
  {
    ...cremerjBase,
    id: "cremerj-jornalista",
    role: "Jornalista",
    professionalArea: "Comunicação",
    specialty: "Jornalismo",
    locations: [{ ...municipalities.rio, reserveOnly: true }],
    salary: 5824.19,
    salaryLabel: "Vencimento-base · 30 h/semana",
    requirement:
      "Graduação em Comunicação Social com habilitação em Jornalismo e registro profissional ativo.",
    eligibility: "Jornalismo e registro profissional",
  },
  {
    ...cremerjBase,
    id: "cremerj-audiovisual",
    role: "Analista de Comunicação Audiovisual",
    professionalArea: "Comunicação",
    specialty: "Audiovisual",
    locations: [{ ...municipalities.rio, reserveOnly: true }],
    salary: 6084.46,
    requirement:
      "Graduação em Cinema, Produção Audiovisual ou Comunicação Social; nesta última, habilitação em Audiovisual, Cinema, Rádio e TV ou Produção Multimídia.",
    eligibility: "Superior nas formações previstas",
  },
  {
    ...cremerjBase,
    id: "cremerj-assistente-operacoes",
    role: "Assistente de Operações",
    professionalArea: "Administração",
    specialty: "Apoio administrativo",
    locations: [{ ...municipalities.rio, reserveOnly: true }],
    salary: 3010,
    salaryLabel: "Vencimento-base · 180 h/mês",
    requirement: "Ensino médio completo.",
    eligibility: "Ensino médio completo",
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
    ...ruralBase,
    id: "ufrrj-engenheiro-seguranca",
    role: "Engenheiro de Segurança do Trabalho",
    professionalArea: "Engenharia",
    specialty: "Segurança do Trabalho",
    salaryLabel: "Vencimento-base · 40 h/semana",
    requirement:
      "Graduação em Engenharia ou Arquitetura, especialização em Segurança do Trabalho e registro profissional, conforme o edital.",
    eligibility: "Engenharia ou Arquitetura e especialização",
  },
  {
    ...ruralBase,
    id: "ufrrj-medico-clinico",
    role: "Médico · Clínico Geral",
    professionalArea: "Saúde",
    specialty: "Clínica Geral",
    salaryLabel: "Vencimento-base · 20 h/semana",
    requirement: "Graduação em Medicina e registro profissional.",
    eligibility: "Medicina e registro profissional",
  },
  {
    ...ruralBase,
    id: "ufrrj-medico-psiquiatra",
    role: "Médico · Psiquiatra",
    professionalArea: "Saúde",
    specialty: "Psiquiatria",
    salaryLabel: "Vencimento-base · 20 h/semana",
    requirement:
      "Graduação em Medicina, residência médica, especialização ou título de especialista em Psiquiatria nas condições do Anexo 1, e registro profissional.",
    eligibility: "Medicina, especialização e registro profissional",
  },
  {
    ...ruralBase,
    id: "ufrrj-veterinario",
    role: "Médico Veterinário · Cirurgia de Pequenos Animais",
    professionalArea: "Ciências Agrárias",
    specialty: "Medicina Veterinária",
    salaryLabel: "Vencimento-base · 20 h/semana",
    requirement: "Graduação em Medicina Veterinária e registro profissional.",
    eligibility: "Medicina Veterinária e registro profissional",
  },
  {
    ...ruralBase,
    id: "ufrrj-zootecnista",
    role: "Zootecnista",
    professionalArea: "Ciências Agrárias",
    specialty: "Zootecnia",
    salaryLabel: "Vencimento-base · 40 h/semana",
    requirement: "Graduação em Zootecnia e registro profissional.",
    eligibility: "Zootecnia e registro profissional",
  },
  {
    ...ruralTechnical,
    id: "ufrrj-assistente-aluno",
    role: "Assistente de Aluno",
    professionalArea: "Educação",
    specialty: "Apoio estudantil",
    salary: 2607.7,
    requirement: "Ensino médio completo.",
    eligibility: "Ensino médio completo",
  },
  {
    ...ruralTechnical,
    id: "ufrrj-laboratorio-biologia",
    role: "Técnico de Laboratório · Biologia/Necropsia",
    professionalArea: "Ciências e Laboratório",
    specialty: "Biologia e Necropsia",
    requirement: laboratoryRequirement,
    eligibility: "Ensino médio profissionalizante ou formação técnica na área",
  },
  {
    ...ruralTechnical,
    id: "ufrrj-laboratorio-materiais",
    role: "Técnico de Laboratório · Engenharia de Materiais",
    professionalArea: "Engenharia",
    specialty: "Materiais",
    requirement: laboratoryRequirement,
    eligibility: "Ensino médio profissionalizante ou formação técnica na área",
  },
  {
    ...ruralTechnical,
    id: "ufrrj-laboratorio-quimica",
    role: "Técnico de Laboratório · Química/Alimentos",
    professionalArea: "Ciências e Laboratório",
    specialty: "Química e Alimentos",
    requirement: laboratoryRequirement,
    eligibility: "Ensino médio profissionalizante ou formação técnica na área",
  },
  {
    ...ruralTechnical,
    id: "ufrrj-laboratorio-solos",
    role: "Técnico de Laboratório · Solos",
    professionalArea: "Ciências Agrárias",
    specialty: "Solos",
    requirement: laboratoryRequirement,
    eligibility: "Ensino médio profissionalizante ou formação técnica na área",
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
  notice: getNotice(item.noticeId),
}));
