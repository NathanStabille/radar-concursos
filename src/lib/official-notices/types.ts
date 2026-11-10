export const ioerjSearchUrl =
  "https://www.ioerj.com.br/portal/modules/conteudoonline/busca_do.php";

export const douAccessUrl =
  "https://www.gov.br/pt-br/servicos/acessar-o-diario-oficial-da-uniao";

export type OfficialNotice = {
  id: string;
  publishedOn: string;
  section: string;
  kind: string;
  excerpt: string;
  url: string;
};

export type OfficialSearchResult = {
  checkedAt: string;
  notices: OfficialNotice[];
  total: number;
};
