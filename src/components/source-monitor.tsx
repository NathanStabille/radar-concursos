import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  sourceDirectory,
  sourceIds,
  type SourceReading,
  type SourceReport,
} from "@/lib/official-notices/monitor-types";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

function sourceStatus(reading?: SourceReading) {
  if (!reading) return { label: "Sem consulta registrada", style: "unknown" };
  if (reading.status === "unavailable")
    return { label: "Falha na última consulta", style: "unknown" };
  if (
    Date.now() - new Date(reading.checkedAt).getTime() >
    48 * 60 * 60 * 1000
  ) {
    return { label: "Consulta desatualizada", style: "unknown" };
  }
  return { label: "Consulta bem-sucedida", style: "open" };
}

export function SourceMonitor() {
  const [report, setReport] = useState<SourceReport | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadReport() {
      try {
        const response = await fetch("/api/official-sources", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Monitoramento indisponível");
        const result = (await response.json()) as SourceReport;
        if (!controller.signal.aborted) setReport(result);
      } catch {
        if (!controller.signal.aborted)
          setReport({ storage: "unavailable", readings: {} });
      }
    }
    void loadReport();
    return () => controller.abort();
  }, []);

  return (
    <section className="main-section" aria-labelledby="source-monitor-heading">
      <div className="section-heading">
        <div>
          <h2 id="source-monitor-heading">Monitoramento de fontes</h2>
          <p>
            Consultas diárias nas fontes abaixo. As publicações exibidas
            aguardam revisão.
          </p>
        </div>
      </div>
      <div role="status" className="official-search-status">
        {!report && <p>Carregando situação das fontes…</p>}
        {report?.storage === "unconfigured" && (
          <p>
            O monitoramento diário ainda não foi configurado nesta implantação.
          </p>
        )}
        {report?.storage === "unavailable" && (
          <p>Não foi possível carregar o monitoramento agora.</p>
        )}
      </div>
      <div className="official-results">
        {sourceIds.map((id) => {
          const source = sourceDirectory[id];
          const reading = report?.readings[id];
          const status = sourceStatus(reading);
          return (
            <article className="official-result" key={id}>
              <div className="official-result-meta">
                <span>{source.scope}</span>
                {report?.storage === "ready" && (
                  <span className={`status ${status.style}`}>
                    {status.label}
                  </span>
                )}
              </div>
              <h3>{source.name}</h3>
              <p>{source.selection}</p>
              {reading && (
                <p className="muted">
                  Última consulta em{" "}
                  {dateTime.format(new Date(reading.checkedAt))} (Brasília).
                  {reading.status === "unavailable" &&
                    reading.lastSuccessAt && (
                      <>
                        {" "}
                        Última leitura bem-sucedida em{" "}
                        {dateTime.format(new Date(reading.lastSuccessAt))}.
                      </>
                    )}
                </p>
              )}
              {reading?.lastSuccessAt &&
                (reading.publications.length ? (
                  <details className="source-publications">
                    <summary>
                      {reading.publications.length === 1
                        ? "1 publicação da última leitura bem-sucedida"
                        : `${reading.publications.length} publicações da última leitura bem-sucedida`}
                    </summary>
                    <ul>
                      {reading.publications.map((publication) => (
                        <li key={publication.url}>
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {publication.title} <ArrowUpRight size={14} />
                          </a>
                          {publication.detail && (
                            <p className="muted">{publication.detail}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <p className="muted">
                    A última leitura bem-sucedida não encontrou publicações no
                    recorte.
                  </p>
                ))}
              <a href={source.url} target="_blank" rel="noreferrer">
                Portal oficial <ArrowUpRight size={14} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
