import { load } from "cheerio";
import {
  ioerjSearchUrl,
  type OfficialNotice,
  type OfficialSearchResult,
} from "./types";

const publicationPath = "/portal/modules/conteudoonline/view_publicacao.php";
const origin = new URL(ioerjSearchUrl).origin;
const resultLimit = 25;

function compact(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function parseSearchResponse(html: string) {
  const $ = load(html);
  const summary = compact(
    $(".conteudo_b").first().children("div").first().text(),
  );

  if (/Nenhuma publicação foi encontrada/i.test(summary)) {
    return { total: 0, notices: [] };
  }

  const count = summary.match(/([\d.]+)\s+matérias? encontradas?/i);
  if (!count) throw new Error("Formato de busca do IOERJ não reconhecido.");

  const notices = new Map<string, OfficialNotice>();
  // O índice do IOERJ agrupa cada matéria em três linhas da tabela.
  for (const element of $(`a[href^="${publicationPath}?"]`).toArray()) {
    const link = $(element);
    const row = link.closest("tr");
    const metadata = compact(row.find(".style2").text());
    const match = metadata.match(/(\d{2}\/\d{2}\/\d{4}).*Matéria Id:\s*(\d+)/i);
    if (!match) continue;

    const [, publishedOn, id] = match;
    if (notices.has(id)) continue;
    const url = new URL(link.attr("href")!, origin);
    if (url.origin !== origin || url.pathname !== publicationPath) continue;

    const labels = row.next().find(".style3");
    const section = compact(labels.eq(0).text()).replace(/^Jornal:\s*/i, "");
    const kind = compact(labels.eq(1).text()).replace(/^Tipo:\s*/i, "");
    const snippet = compact(row.next().next().find(".style4").text());
    const excerpt =
      snippet.length > 280 ? `${snippet.slice(0, 277).trimEnd()}…` : snippet;
    notices.set(id, { id, publishedOn, section, kind, excerpt, url: url.href });
    if (notices.size === resultLimit) break;
  }

  const total = Number(count[1].replaceAll(".", ""));
  if (total > 0 && !notices.size) {
    throw new Error(
      "O índice do IOERJ retornou resultados em formato desconhecido.",
    );
  }

  return { total, notices: [...notices.values()] };
}

export async function searchIoerj(
  term: string,
  month: string,
): Promise<OfficialSearchResult> {
  const [year, monthNumber] = month.split("-");
  const form = new URLSearchParams({
    textobusca: term,
    "busca[jornal]": "",
    "datapublicacao[dia]": "",
    "datapublicacao[mes]": monthNumber,
    "datapublicacao[ano]": year,
    tipobusca: "texto",
    buscaordem: "datapublicacao desc",
    buscar: "Buscar",
  });

  const response = await fetch(`${ioerjSearchUrl}?acao=busca`, {
    method: "POST",
    body: form,
    headers: { Accept: "text/html" },
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    throw new Error("O IOERJ não respondeu com o índice de publicações.");
  }

  const result = parseSearchResponse(await response.text());
  return { ...result, checkedAt: new Date().toISOString() };
}
