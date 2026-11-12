import {
  ArrowUpRight,
  Bookmark,
  Building2,
  CalendarDays,
  Info,
  MapPin,
} from "lucide-react";
import type { WorkLocation } from "@/data/locations";
import type { Opportunity } from "@/types/catalog";
import {
  currency,
  locationSummary,
  period,
  status,
  statusNames,
} from "@/lib/catalog";

type OpportunityCardProps = {
  item: Opportunity;
  locations: WorkLocation[];
  today: string;
  isSaved: boolean;
  isSelected: boolean;
  onDetails: () => void;
  onFavorite: () => void;
  onCompare: () => void;
};

export function OpportunityCard({
  item,
  locations,
  today,
  isSaved,
  isSelected,
  onDetails,
  onFavorite,
  onCompare,
}: OpportunityCardProps) {
  const currentStatus = status(item, today);
  return (
    <article
      className={`record${isSelected ? " is-selected" : ""}`}
      aria-labelledby={`role-${item.id}`}
    >
      <div className="record-heading">
        <span className="org-icon">
          <Building2 size={18} />
        </span>
        <div className="org">
          <strong>{item.org}</strong>
          <span>
            {item.notice.title} · {item.kind}
          </span>
        </div>
        <button
          type="button"
          className={`icon-button favorite-button${isSaved ? " marked" : ""}`}
          aria-label={`${isSaved ? "Remover dos favoritos" : "Favoritar"}: ${item.role}`}
          aria-pressed={isSaved}
          title={isSaved ? "Remover dos favoritos" : "Favoritar"}
          onClick={onFavorite}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="record-main">
        <span className="area">
          {item.professionalArea} · {item.specialty}
        </span>
        <h3 id={`role-${item.id}`}>
          <button onClick={onDetails}>{item.role}</button>
        </h3>
        <p className="record-location">
          <MapPin size={14} />
          {locationSummary(locations)}
        </p>
      </div>
      <div className="record-pay">
        <span className="field-label">Remuneração</span>
        <strong>
          {item.salary === null
            ? "Não confirmada"
            : currency.format(item.salary)}
        </strong>
        <span className="muted">{item.salaryLabel}</span>
      </div>
      <dl className="record-fields">
        <div>
          <dt>Formação e requisitos</dt>
          <dd>{item.eligibility}</dd>
        </div>
        <div>
          <dt>Banca / organização</dt>
          <dd>{item.board || "Não confirmada"}</dd>
        </div>
      </dl>
      <div className="record-period">
        <span className={`status ${currentStatus}`}>
          {statusNames[currentStatus]}
        </span>
        <span className="record-dates">
          <CalendarDays size={14} />
          {period(item)}
        </span>
      </div>
      {item.note && (
        <button className="uncertain" type="button" onClick={onDetails}>
          <Info size={14} />
          Há informação a confirmar. Ver detalhes.
        </button>
      )}
      <div className="record-bottom">
        <button className="details-button" onClick={onDetails}>
          Ver detalhes <ArrowUpRight size={16} />
        </button>
        <label className="compare-check">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onCompare}
            aria-label={`Comparar: ${item.role}`}
          />
          Comparar
        </label>
      </div>
    </article>
  );
}
