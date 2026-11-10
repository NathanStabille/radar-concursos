import { loadBuffer } from "cheerio";
import { localDateTime } from "@/lib/catalog";
import { searchIoerj } from "./ioerj";
import {
  sourceDirectory,
  type SourceId,
  type SourcePublication,
} from "./monitor-types";

const publicationLimit = 6;

function compact(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

async function readIndex(url: string, encoding?: "utf-8") {
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    throw new Error("Índice indisponível.");
  }
  return loadBuffer(Buffer.from(await response.arrayBuffer()), {
    encoding: { transportLayerEncodingLabel: encoding },
  });
}

function publicationLink(
  href: string | undefined,
  index: string,
  path: string,
) {
  if (!href) return undefined;
  const url = new URL(href, index);
  if (url.origin !== new URL(index).origin || !url.pathname.startsWith(path)) {
    return undefined;
  }
  return url.href;
}

function uniquePublications(entries: SourcePublication[]) {
  return [
    ...new Map(entries.map((entry) => [entry.url, entry])).values(),
  ].slice(0, publicationLimit);
}

async function readUfrrj(): Promise<SourcePublication[]> {
  const { url } = sourceDirectory.ufrrj;
  const $ = await readIndex(url);
  const boxes = $('[id^="detalhar_bloq"].box_concurso');
  if (!boxes.length)
    throw new Error("Índice de concursos da UFRRJ não reconhecido.");

  const publications: SourcePublication[] = [];
  boxes.each((_, box) => {
    const detail = compact($(box).prev(".box_concurso").text());
    $(box)
      .find("a")
      .each((_, anchor) => {
        const title = compact($(anchor).text());
        if (
          !/^(edital|retifica|cronograma|aviso de prorrogação|comunicado sobre prazo)/i.test(
            title,
          )
        )
          return;
        const link = publicationLink(
          $(anchor).attr("href"),
          url,
          "/concursos/editais/",
        );
        if (link) publications.push({ title, url: link, detail });
      });
  });
  return uniquePublications(publications);
}

async function readPraiaGrande(): Promise<SourcePublication[]> {
  const index = new URL(sourceDirectory.praiaGrande.url);
  index.searchParams.set("Edital", localDateTime().slice(0, 4));
  // O portal declara a codificação de forma inconsistente, mas os títulos são UTF-8.
  const $ = await readIndex(index.href, "utf-8");
  const links = $('a.link_pag2[href^="/arquivos/concurso/"]');
  if (!links.length) {
    if (/Nenhum Concurso Encontrado/i.test($("body").text())) return [];
    throw new Error("Índice de concursos de Praia Grande não reconhecido.");
  }

  const publications: SourcePublication[] = [];
  links.each((_, anchor) => {
    const title = compact($(anchor).text());
    if (
      !/^(edital de abertura|retifica|prorroga|reabertura)/i.test(title) ||
      /promoção interna/i.test(title)
    )
      return;
    const link = publicationLink(
      $(anchor).attr("href"),
      index.href,
      "/arquivos/concurso/",
    );
    const detail = compact($(anchor).closest("tr").find("td").eq(1).text());
    if (link) publications.push({ title, url: link, detail });
  });
  return uniquePublications(publications);
}

async function readIoerj(): Promise<SourcePublication[]> {
  const result = await searchIoerj(
    "concurso público",
    localDateTime().slice(0, 7),
  );
  return result.notices.slice(0, publicationLimit).map((notice) => ({
    title: `${notice.kind || "Matéria oficial"} · ${notice.id}`,
    url: notice.url,
    detail: [notice.publishedOn, notice.section].filter(Boolean).join(" · "),
  }));
}

export const readSource: Record<SourceId, () => Promise<SourcePublication[]>> =
  {
    ioerj: readIoerj,
    ufrrj: readUfrrj,
    praiaGrande: readPraiaGrande,
  };
