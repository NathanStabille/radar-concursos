import type { Notice } from "@/types/catalog";
export { changeCategories } from "@/types/catalog";
export type { ChangeCategory } from "@/types/catalog";

export const notices = {
  "cremerj-01-2026": {
    org: "CREMERJ",
    title: "Edital nº 1/2026",
    source: {
      label: "Edital consolidado",
      url: "https://cdnsite.institutoconsulplan.org.br/concursos/1337/337e753b4a834b4ba9de5a728159457b.pdf",
    },
    amendments: {
      "prorrogacao-29-10": {
        date: "2026-10-29",
        title: "Inscrições prorrogadas até 6 de novembro",
        source: {
          label: "Comunicado do CREMERJ",
          url: "https://portal.cremerj.org.br/noticias/cremerj-torna-publica-prorrogacao-de-inscricoes-para-concurso-publico",
        },
        changes: [
          {
            category: "Prazo",
            field: "Encerramento das inscrições",
            before: "29/10/2026, às 16h",
            after: "06/11/2026, às 16h",
            context: "Horário de Brasília.",
          },
        ],
      },
      "retificacao-2": {
        date: "2026-10-02",
        title: "Retificação II",
        source: {
          label: "Retificação II do CREMERJ",
          url: "https://transparencia.cremerj.org.br/wp-content/uploads/2026/10/Retificacao-II.pdf",
        },
        changes: [
          {
            category: "Prazo",
            field: "Encerramento das inscrições",
            before: "22/10/2026, às 16h",
            after: "29/10/2026, às 16h",
          },
          {
            category: "Escolaridade",
            field: "Formação aceita para cargos de TI",
            before: "Bacharelado nas formações previstas para cada cargo.",
            after:
              "Bacharelado ou curso superior de tecnologia na área de TI, conforme o quadro retificado.",
            context:
              "Afeta os cargos de Banco de Dados, Ciência e Análise de Dados, Desenvolvimento de Sistemas e Suporte.",
            opportunityIds: [
              "cremerj-dba",
              "cremerj-ciencia-dados",
              "cremerj-dev",
              "cremerj-suporte",
            ],
          },
        ],
      },
    },
  },
  "ufrrj-52-2026": {
    org: "UFRRJ",
    title: "Edital nº 52/2026",
    source: {
      label: "Edital retificado",
      url: "https://servicos.ufrrj.br/concursos/editais/EDITAL52-2026-TAE_SUPERIOR_retificado_.pdf",
    },
    requirementsSource: {
      label: "Requisitos e atribuições dos cargos",
      url: "https://servicos.ufrrj.br/concursos/editais/atribuicao_dos_cargos_2026.pdf",
    },
    amendments: {
      "pagamento-18-09": {
        date: "2026-09-18",
        title: "Prorrogação do pagamento",
        source: {
          label: "Aviso da UFRRJ",
          url: "https://servicos.ufrrj.br/concursos/editais/AVISO_DE_PRORROGACAO_DE_DATA_DE_PAGAMENTO.pdf",
        },
        changes: [
          {
            category: "Prazo",
            field: "Pagamento da taxa de inscrição",
            before: "17/09/2026",
            after: "18/09/2026, às 17h",
            context:
              "Era necessário gerar nova GRU. O prazo de inscrição permaneceu em 17/09.",
          },
        ],
      },
    },
  },
  "ufrrj-53-2026": {
    org: "UFRRJ",
    title: "Edital nº 53/2026",
    source: {
      label: "Edital retificado em 06/11/2026",
      url: "https://servicos.ufrrj.br/concursos/editais/edital53-2026retificado3.pdf",
    },
    requirementsSource: {
      label: "Requisitos e atribuições dos cargos",
      url: "https://servicos.ufrrj.br/concursos/editais/atribuicao_dos_cargos_53_2026.pdf",
    },
  },
  "dataprev-2026": {
    org: "Dataprev",
    title: "Concurso público de 2026",
    source: {
      label: "Edital retificado",
      url: "https://conhecimento.fgv.br/sites/default/files/concursos/29.10-edital-2-retificacao-dataprev.pdf",
    },
  },
  "tjrj-01-2025": {
    org: "TJRJ",
    title: "Edital nº 01/2025",
    source: {
      label: "Página oficial do concurso e editais",
      url: "https://conhecimento.fgv.br/concursos/tjrjservidores25/01",
    },
    amendments: {
      "retificacao-1": {
        date: "2025-10-27",
        title: "Primeira retificação do edital",
        source: {
          label: "Retificação na FGV",
          url: "https://conhecimento.fgv.br/sites/default/files/concursos/1a-retificacao-edital-de-abertura-tjrj-analista-judiciario-24.10-sugestoes_0.pdf",
        },
        changes: [
          {
            category: "Prazo",
            field: "Horário da prova em 01/02/2026",
            before: "Prova das 13h às 18h. Portões fechavam às 12h30.",
            after: "Prova das 14h30 às 19h30. Portões fechavam às 14h.",
            context: "Horário de Brasília.",
          },
        ],
      },
    },
  },
  "fiotec-bio-004-fio-25": {
    org: "Fiotec / Bio-Manguinhos",
    title: "Chamada BIO-004-FIO-25",
    source: {
      label: "Chamada oficial da Fiotec",
      url: "https://www.fiotec.fiocruz.br/pt/vagas-projetos/processos-seletivos-simplificados/em-aberto/analista-de-desenvolvimento-de-sistemas-bio-004-fio-24-1-vaga",
    },
  },
  "seplag-rj-2026": {
    org: "SEPLAG-RJ",
    title: "Edital de 31/08/2026",
    source: {
      label: "Página oficial do concurso e editais",
      url: "https://conhecimento.fgv.br/concursos/seplagrj",
    },
  },
  "praia-grande-001-2026": {
    org: "Prefeitura de Praia Grande",
    title: "Edital nº 001/2026",
    source: {
      label: "Edital de abertura",
      url: "https://www.praiagrande.sp.gov.br/arquivos/concurso/3322.pdf",
    },
    amendments: {
      "retificacao-29-04": {
        date: "2026-04-29",
        title: "Correção do quadro de vencimentos",
        source: {
          label: "Retificação da Prefeitura",
          url: "https://www.praiagrande.sp.gov.br/arquivos/concurso/3325.pdf",
        },
        changes: [
          {
            category: "Remuneração",
            field: "Vencimentos de Médico Mensalista do Trabalho",
            before:
              "Base de R$ 5.773,44, com menção a remuneração de até R$ 25.000,00 por produtividade.",
            after:
              "Base de R$ 5.773,44. A previsão de até R$ 25.000,00 foi retirada do quadro do edital.",
            context: "Jornada de 20 horas semanais.",
            opportunityIds: ["praia-grande-medico-trabalho"],
          },
        ],
      },
    },
  },
} satisfies Record<string, Notice>;

export type NoticeId = keyof typeof notices;

export function getNotice(noticeId: NoticeId): Notice {
  return notices[noticeId];
}
