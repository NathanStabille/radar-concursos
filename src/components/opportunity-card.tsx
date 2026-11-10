import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  GitCompareArrows,
  Info,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { currency, period, status, statusNames } from "@/lib/catalog";

type OpportunityCardProps = {
  item: Opportunity;
  today: string;
  isSaved: boolean;
  isSelected: boolean;
  onDetails: () => void;
  onFavorite: () => void;
  onCompare: () => void;
};

export function OpportunityCard({
  item,
  today,
  isSaved,
  isSelected,
  onDetails,
  onFavorite,
  onCompare,
}: OpportunityCardProps) {
  const currentStatus = status(item, today);
  return (
    <article className="record">
      <div className="record-main">
        <div className="org">
          <Building2 size={14} /> {item.org} <span>· {item.kind}</span>
        </div>
        <h3>
          <button onClick={onDetails}>{item.role}</button>
        </h3>
        <div className="record-meta">
          <span>
            <MapPin size={14} /> {item.city || "Município não confirmado"}
          </span>
          <span className="area">{item.area}</span>
        </div>
      </div>
      <div className="record-pay">
        <span className="field-label">REMUNERAÇÃO</span>
        <strong>
          {item.salary === null
            ? "Não confirmada"
            : currency.format(item.salary)}
        </strong>
        <span className="muted">{item.salaryLabel}</span>
      </div>
      <div className="record-period">
        <span className={"status " + currentStatus}>
          {statusNames[currentStatus]}
        </span>
        <span className="record-dates">
          <CalendarDays size={14} /> {period(item)}
        </span>
      </div>
      <div className="record-bottom">
        <div className="eligibility">
          <ShieldCheck size={16} /> {item.eligibility}
          <span className="board">· {item.board}</span>
          {item.note && (
            <span className="uncertain" title={item.note}>
              <Info size={14} /> Dado a confirmar
            </span>
          )}
        </div>
        <div className="actions">
          <button
            className={"icon-button " + (isSaved ? "marked" : "")}
            aria-label={
              (isSaved ? "Remover dos favoritos: " : "Favoritar: ") + item.role
            }
            aria-pressed={isSaved}
            title={isSaved ? "Remover dos favoritos" : "Favoritar"}
            onClick={onFavorite}
          >
            <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            className={"icon-button " + (isSelected ? "marked" : "")}
            aria-label={
              (isSelected
                ? "Remover da comparação: "
                : "Selecionar para comparar: ") + item.role
            }
            aria-pressed={isSelected}
            title={
              isSelected ? "Remover da comparação" : "Selecionar para comparar"
            }
            onClick={onCompare}
          >
            <GitCompareArrows size={17} />
          </button>
          <button className="details-button" onClick={onDetails}>
            Ver detalhes <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
