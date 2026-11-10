import { ArrowUpRight } from "lucide-react";
import type { Change } from "@/data/opportunities";
import { date } from "@/lib/catalog";

export function Timeline({ entries }: { entries: Change[] }) {
  return entries.length ? (
    <ol className="timeline">
      {entries.map((change) => (
        <li key={change.id}>
          <div className="change-date">
            {date(change.date)} <span>{change.kind}</span>
          </div>
          <h3>
            {change.org} <span>·</span> {change.title}
          </h3>
          <p>{change.description}</p>
          <a href={change.url} target="_blank" rel="noreferrer">
            {change.url.includes("jcconcursos.com.br")
              ? "Retificação oficial (cópia)"
              : "Documento oficial"}{" "}
            <ArrowUpRight size={14} />
          </a>
        </li>
      ))}
    </ol>
  ) : (
    <p className="muted">
      Nenhuma mudança de prazo ou requisito foi registrada nas fontes
      consultadas.
    </p>
  );
}
