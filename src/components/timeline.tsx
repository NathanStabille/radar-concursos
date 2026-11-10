import { ArrowUpRight } from "lucide-react";
import type { AmendmentHistoryEntry } from "@/lib/amendments";
import { date } from "@/lib/catalog";

export function Timeline({ entries }: { entries: AmendmentHistoryEntry[] }) {
  return entries.length ? (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={entry.id}>
          <div className="change-date">
            <time dateTime={entry.date}>{date(entry.date)}</time>
            <span>Fonte conferida</span>
          </div>
          <h3>{entry.title}</h3>
          <p>
            {entry.notice.org} · {entry.notice.title}
          </p>
          <div className="amendment-changes">
            {entry.changes.map((change) => (
              <section className="amendment-change" key={change.field}>
                <span className="area">{change.category}</span>
                <h4>{change.field}</h4>
                <dl>
                  {change.before && (
                    <div>
                      <dt>Antes</dt>
                      <dd>{change.before}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Depois</dt>
                    <dd>{change.after}</dd>
                  </div>
                </dl>
                {change.context && <p>{change.context}</p>}
              </section>
            ))}
          </div>
          <div className="amendment-links">
            <a href={entry.source.url} target="_blank" rel="noreferrer">
              {entry.source.label} <ArrowUpRight size={14} />
            </a>
            <a href={entry.notice.source.url} target="_blank" rel="noreferrer">
              {entry.notice.source.label} <ArrowUpRight size={14} />
            </a>
          </div>
        </li>
      ))}
    </ol>
  ) : (
    <p className="muted">Nenhuma mudança conferida para esta seleção.</p>
  );
}
