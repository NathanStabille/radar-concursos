import { useState, type FormEvent } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import {
  douAccessUrl,
  ioerjSearchUrl,
  type OfficialSearchResult,
} from "@/lib/official-notices/types";

type SearchState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; result: OfficialSearchResult };

const checkedAtFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function OfficialSearch({ currentMonth }: { currentMonth: string }) {
  const [term, setTerm] = useState("concurso público");
  const [month, setMonth] = useState(currentMonth);
  const [search, setSearch] = useState<SearchState>({ status: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (search.status === "loading") return;
    setSearch({ status: "loading" });

    try {
      const params = new URLSearchParams({ q: term.trim(), month });
      const response = await fetch(`/api/official-notices?${params}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const error = (await response.json()) as { error: string };
        setSearch({ status: "error", message: error.error });
        return;
      }
      const result = (await response.json()) as OfficialSearchResult;
      setSearch({ status: "success", result });
    } catch {
      setSearch({
        status: "error",
        message: "A consulta não pôde ser concluída. Tente novamente.",
      });
    }
  }

  return (
    <section className="main-section">
      <div className="section-heading">
        <div>
          <h2>Busca em fontes oficiais</h2>
          <p>
            Consulte as publicações indexadas pelo Diário Oficial do Rio de
            Janeiro.
          </p>
        </div>
      </div>

      <form className="filter-panel official-search-form" onSubmit={submit}>
        <label className="search">
          <Search size={18} />
          <span className="sr-only">Termo de busca oficial</span>
          <input
            required
            minLength={3}
            maxLength={80}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Cargo, órgão ou termo do edital"
            disabled={search.status === "loading"}
          />
        </label>
        <label className="official-month">
          Mês da publicação
          <input
            required
            type="month"
            min="2005-01"
            max={currentMonth}
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            disabled={search.status === "loading"}
          />
        </label>
        <button className="primary" disabled={search.status === "loading"}>
          {search.status === "loading"
            ? "Consultando…"
            : "Buscar no Diário do RJ"}
        </button>
      </form>

      <div className="official-source-links">
        <a href={ioerjSearchUrl} target="_blank" rel="noreferrer">
          Busca oficial do RJ <ArrowUpRight size={14} />
        </a>
        <a href={douAccessUrl} target="_blank" rel="noreferrer">
          Diário Oficial da União · consulta externa <ArrowUpRight size={14} />
        </a>
      </div>

      <p className="official-search-note">
        As matérias ficam separadas do catálogo. Formação exigida, vagas e
        prazos precisam de conferência no documento oficial.
      </p>

      <div role="status" className="official-search-status">
        {search.status === "loading" && "Consultando o Diário Oficial do RJ…"}
        {search.status === "error" && (
          <p className="callout">{search.message}</p>
        )}
        {search.status === "success" && (
          <>
            <p>
              {search.result.total === 0
                ? "Nenhuma publicação encontrada para esse termo e mês."
                : `Exibindo ${search.result.notices.length} de ${search.result.total} publicações encontradas.`}
            </p>
            <p>
              Consultado em{" "}
              {checkedAtFormat.format(new Date(search.result.checkedAt))}{" "}
              (Brasília).
            </p>
          </>
        )}
      </div>

      {search.status === "success" && search.result.notices.length > 0 && (
        <div className="official-results">
          {search.result.notices.map((notice) => (
            <article className="official-result" key={notice.id}>
              <div className="official-result-meta">
                <span>
                  {notice.publishedOn} · Matéria {notice.id}
                </span>
                <span className="status unknown">Revisão pendente</span>
              </div>
              <h3>{notice.kind || "Publicação oficial"}</h3>
              {notice.section && <p className="muted">{notice.section}</p>}
              {notice.excerpt && <p>{notice.excerpt}</p>}
              <a href={notice.url} target="_blank" rel="noreferrer">
                Abrir publicação oficial <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
