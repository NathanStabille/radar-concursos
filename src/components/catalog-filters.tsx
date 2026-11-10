import { ChevronDown, Search } from "lucide-react";
import {
  initialFilters,
  municipalityOptions,
  options,
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
  values: (filters: Filters) => FilterOption[];
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
    values: (filters) => municipalityOptions(filters.state),
  },
  {
    key: "professionalArea",
    label: "Área profissional",
    placeholder: "Todas as áreas",
    values: () => options("professionalArea").map((area) => [area, area]),
  },
  {
    key: "specialty",
    label: "Especialidade",
    placeholder: "Todas as especialidades",
    values: (filters) =>
      options("specialty", filters.professionalArea).map((specialty) => [
        specialty,
        specialty,
      ]),
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
  onChange: (key: keyof Filters, value: string) => void;
};

export function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  return (
    <div className="filter-panel">
      <label className="search">
        <Search size={18} />
        <span className="sr-only">Buscar oportunidades</span>
        <input
          value={filters.search}
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
                {values(filters).map(([value, name]) => (
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
