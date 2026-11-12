import type { CatalogFacets } from "@/types/catalog";
import { ChevronDown, Search } from "lucide-react";
import {
  initialFilters,
  municipalityOptions,
  stateOptions,
  statusNames,
} from "@/lib/catalog";

type Filters = typeof initialFilters;
type SelectFilter = Exclude<keyof Filters, "search">;
type FilterOption = [value: string, label: string];

const filterDefinitions: {
  key: SelectFilter;
  label: string;
  placeholder: string;
  values: (filters: Filters, facets: CatalogFacets) => FilterOption[];
}[] = [
  {
    key: "state",
    label: "UF de lotação",
    placeholder: "Todas as UFs",
    values: () =>
      stateOptions.map(([code, name]) => [code, `${name} (${code})`]),
  },
  {
    key: "municipality",
    label: "Município de lotação",
    placeholder: "Todos os municípios",
    values: (filters, facets) =>
      municipalityOptions(facets.municipalities, filters.state),
  },
  {
    key: "professionalArea",
    label: "Área profissional",
    placeholder: "Todas as áreas",
    values: (_filters, facets) =>
      facets.areas.map(({ name, count }) => [name, `${name} (${count})`]),
  },
  {
    key: "specialty",
    label: "Especialidade",
    placeholder: "Todas as especialidades",
    values: (filters, facets) =>
      [
        ...new Set(
          facets.specialties
            .filter(
              (item) =>
                !filters.professionalArea ||
                item.area === filters.professionalArea,
            )
            .map((item) => item.name),
        ),
      ]
        .sort((a, b) => a.localeCompare(b, "pt-BR"))
        .map((name) => [name, name]),
  },
  {
    key: "salary",
    label: "Faixa salarial",
    placeholder: "Todas as faixas",
    values: () => [
      ["low", "Abaixo de R$ 8 mil"],
      ["mid", "R$ 8 mil a menos de R$ 10 mil"],
      ["high", "A partir de R$ 10 mil"],
      ["unknown", "Não confirmada"],
    ],
  },
  {
    key: "status",
    label: "Situação",
    placeholder: "Todas as situações",
    values: () => Object.entries(statusNames),
  },
];

type CatalogFiltersProps = {
  filters: Filters;
  facets: CatalogFacets;
  onChange: (key: keyof Filters, value: string) => void;
};

export function CatalogFilters({
  filters,
  facets,
  onChange,
}: CatalogFiltersProps) {
  return (
    <div className="filter-panel">
      <label className="search">
        <Search size={18} />
        <span className="sr-only">Buscar oportunidades</span>
        <input
          value={filters.search}
          maxLength={100}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Buscar cargo, órgão, município ou palavra-chave"
        />
      </label>
      <div className="filters">
        {filterDefinitions.map(({ key, label, placeholder, values }) => (
          <label key={key}>
            <span>{label}</span>
            <span className="select-wrap">
              <select
                value={filters[key]}
                onChange={(event) => onChange(key, event.target.value)}
              >
                <option value="">{placeholder}</option>
                {values(filters, facets).map(([value, name]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
