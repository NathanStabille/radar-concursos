import { Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return (
    <nav className="pagination" aria-label="Paginação do catálogo">
      <button
        type="button"
        className="outline pagination-direction"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} /> <span>Anterior</span>
      </button>
      <div className="pagination-pages">
        {pages.map((value, index) => (
          <Fragment key={value}>
            {index > 0 && value - pages[index - 1] > 1 && (
              <span className="pagination-gap" aria-hidden="true">
                …
              </span>
            )}
            <button
              type="button"
              aria-label={`Página ${value}`}
              aria-current={page === value ? "page" : undefined}
              onClick={() => onChange(value)}
            >
              {value}
            </button>
          </Fragment>
        ))}
      </div>
      <button
        type="button"
        className="outline pagination-direction"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Próxima página"
      >
        <span>Próxima</span> <ChevronRight size={16} />
      </button>
    </nav>
  );
}
