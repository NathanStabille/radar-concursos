export const reviewDate = "10/11/2026";

export type Change = {
  id: string;
  org: string;
  date: string;
  kind: "Prazo" | "Escolaridade";
  title: string;
  description: string;
  url: string;
};

export type Opportunity = {
  id: string;
  org: string;
  role: string;
  kind: "Concurso público" | "Seleção simplificada";
  professionalArea: string;
  specialty: string;
  city: string;
  cities: string[];
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
  url: string;
  changes: Change[];
};

const capital = "Rio de Janeiro";
const capitalLocation = { city: capital, cities: [capital] };
const publicExam = "Concurso público" as const;
const inProgress = "ongoing" as const;
const technology = "Tecnologia da Informação";
const explicit = "ADS citado no edital";
const technologist = "Tecnólogo em TI aceito";
const technologyDegree =
  "Diploma registrado de bacharelado ou tecnólogo em TI, de instituição credenciada pelo MEC, conforme o Anexo II.";
const cremerj =
  "https://portal.cremerj.org.br/noticias/cremerj-torna-publica-prorrogacao-de-inscricoes-para-concurso-publico";
const cremerjNotice =
  "https://cdnsite.institutoconsulplan.org.br/concursos/1337/337e753b4a834b4ba9de5a728159457b.pdf";
const cremerjAmendment =
  "https://jcconcursos.com.br/media/uploads/anexos/concurso-cremerj-edital-1-2026-retificacao-2.pdf";
const cremerjChanges: Change[] = [
  {
    id: "cremerj-extension-2",
    org: "CREMERJ",
    date: "2026-10-29",
    kind: "Prazo",
    title: "Inscrições prorrogadas até 6 de novembro",
    description:
      "O encerramento passou de 29/10 para 06/11/2026, às 16h, no horário de Brasília.",
    url: cremerj,
  },
  {
    id: "cremerj-extension-1",
    org: "CREMERJ",
    date: "2026-10-02",
    kind: "Prazo",
    title: "Primeira prorrogação de inscrições",
    description:
      "A Retificação II alterou a data final de 22/10 para 29/10/2026.",
    url: cremerjAmendment,
  },
  {
    id: "cremerj-schooling",
    org: "CREMERJ",
    date: "2026-10-02",
    kind: "Escolaridade",
    title: "Tecnólogo passou a ser aceito",
    description:
      "A Retificação II passou a aceitar curso superior de tecnologia na área de TI para Analista de Banco de Dados, de Desenvolvimento de Sistemas, de Ciência e Análise de Dados e de Suporte.",
    url: cremerjAmendment,
  },
];

const cremerjBase = {
  org: "CREMERJ",
  kind: publicExam,
  ...capitalLocation,
  salary: 7765.48,
  salaryLabel: "Salário inicial · 40 h/semana",
  board: "Instituto Consulplan",
  start: "2026-09-23",
  startHour: "16:00",
  end: "2026-11-06",
  endHour: "16:00",
  stage: inProgress,
  url: cremerjNotice,
};

const cremerjTechnology = {
  ...cremerjBase,
  professionalArea: technology,
  requirement:
    "Diploma de bacharelado ou curso superior de tecnologia na área de TI, reconhecido pelo MEC, conforme a Retificação II do Edital nº 1/2026.",
  eligibility: technologist,
  changes: cremerjChanges,
};

const ruralBase = {
  org: "UFRRJ",
  kind: publicExam,
  city: "Lotação a definir (RJ)",
  cities: ["Seropédica", "Nova Iguaçu", "Três Rios", "Campos dos Goytacazes"],
  salary: 5215.39,
  board: "Comissão da UFRRJ",
  start: "2026-08-19",
  end: "2026-09-17",
  stage: inProgress,
  note: "Município de lotação ainda não confirmado. O edital lista Seropédica, Nova Iguaçu, Três Rios e Campos dos Goytacazes como possibilidades, a critério da UFRRJ.",
  url: "https://servicos.ufrrj.br/concursos/editais/EDITAL52-2026-TAE_SUPERIOR_retificado_.pdf",
  changes: [
    {
      id: "ufrrj-payment",
      org: "UFRRJ",
      date: "2026-09-18",
      kind: "Prazo" as const,
      title: "Pagamento prorrogado",
      description:
        "A taxa pôde ser paga até 17h de 18/09/2026 com nova GRU. O período de inscrição permaneceu encerrado em 17/09.",
      url: "https://servicos.ufrrj.br/concursos/editais/AVISO_DE_PRORROGACAO_DE_DATA_DE_PAGAMENTO.pdf",
    },
  ],
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
  org: "Dataprev",
  kind: publicExam,
  ...capitalLocation,
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
  url: "https://conhecimento.fgv.br/concursos/dataprev26",
  changes: [],
};

const tribunalBase = {
  professionalArea: technology,
  org: "TJRJ",
  kind: publicExam,
  ...capitalLocation,
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
  url: "https://conhecimento.fgv.br/concursos/tjrjservidores25/01",
  changes: [
    {
      id: "tjrj-exam-time",
      org: "TJRJ",
      date: "2025-10-27",
      kind: "Prazo" as const,
      title: "Horário de prova alterado",
      description:
        "A primeira retificação mudou o horário de início da prova de 13h para 14h30 e o fechamento dos portões de 12h30 para 14h em 01/02/2026.",
      url: "https://conhecimento.fgv.br/sites/default/files/concursos/1a-retificacao-edital-de-abertura-tjrj-analista-judiciario-24.10-sugestoes_0.pdf",
    },
  ],
};

export const opportunities: Opportunity[] = [
  {
    id: "fiotec-bio",
    org: "Fiotec / Bio-Manguinhos",
    role: "Analista de Desenvolvimento de Sistemas",
    kind: "Seleção simplificada",
    professionalArea: technology,
    specialty: "Desenvolvimento",
    ...capitalLocation,
    salary: 9637.47,
    salaryLabel: "Salário mensal · 40 h/semana",
    board: "Fiotec",
    requirement:
      "Graduação completa em ADS ou em outra área indicada no anúncio. Exige experiência com .NET e C# MVC, aplicações web, SQL Server, IIS e outras competências descritas na chamada. CLT por prazo determinado.",
    eligibility: "ADS citado na chamada",
    end: "2026-11-07",
    stage: "closed",
    note: "A chamada confirma o prazo final, mas não indica expressamente o dia de abertura das inscrições.",
    url: "https://www.fiotec.fiocruz.br/pt/vagas-projetos/processos-seletivos-simplificados/em-aberto/analista-de-desenvolvimento-de-sistemas-bio-004-fio-24-1-vaga",
    changes: [],
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
    changes: cremerjChanges.filter((change) => change.kind === "Prazo"),
  },
  {
    id: "seplag-apo-ti",
    org: "SEPLAG-RJ",
    role: "Analista de Planejamento e Orçamento · TI",
    kind: publicExam,
    professionalArea: technology,
    specialty: "Gestão de TI",
    city: "Lotação a confirmar (RJ)",
    cities: [],
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
    url: "https://conhecimento.fgv.br/concursos/seplagrj",
    changes: [],
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
    role: "Analista de TI · Desenvolvimento de Software",
    specialty: "Desenvolvimento",
  },
  {
    ...dataprevBase,
    id: "dataprev-negocio",
    role: "Analista de TI · Análise de Negócio de TI",
    specialty: "Gestão de TI",
  },
  {
    ...dataprevBase,
    id: "dataprev-seg",
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
];
