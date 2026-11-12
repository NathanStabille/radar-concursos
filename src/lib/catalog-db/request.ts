import { stateNames } from "@/data/locations";
import { initialFilters, statusNames } from "@/lib/catalog";

export type CatalogRequest = {
  filters: typeof initialFilters;
  sort: "recent" | "salary" | "org";
  page: number;
  ids?: string[];
};
export const initialRequest: CatalogRequest = {
  filters: initialFilters,
  sort: "recent",
  page: 1,
};
export class InvalidCatalogRequest extends Error {}

export function parseCatalogRequest(params: URLSearchParams): CatalogRequest {
  for (const key of ["sort", "page", "ids"]) {
    if (params.getAll(key).length > 1)
      throw new InvalidCatalogRequest("Parâmetro repetido.");
  }
  const filters = { ...initialFilters };
  for (const key of Object.keys(filters) as (keyof typeof filters)[]) {
    if (params.getAll(key).length > 1)
      throw new InvalidCatalogRequest("Filtro repetido.");
    const value = (params.get(key) ?? "").trim();
    if (
      value.length > (key === "search" ? 100 : 120) ||
      /[\u0000-\u001f]/.test(value)
    )
      throw new InvalidCatalogRequest("Filtro inválido.");
    filters[key] = value;
  }
  if (filters.state && !Object.hasOwn(stateNames, filters.state))
    throw new InvalidCatalogRequest("UF inválida.");
  if (filters.municipality && !/^\d{7}$/.test(filters.municipality))
    throw new InvalidCatalogRequest("Município inválido.");
  if (filters.status && !Object.hasOwn(statusNames, filters.status))
    throw new InvalidCatalogRequest("Situação inválida.");
  if (
    filters.salary &&
    !["low", "mid", "high", "unknown"].includes(filters.salary)
  )
    throw new InvalidCatalogRequest("Faixa salarial inválida.");
  const sort = params.get("sort") ?? "recent";
  if (!["recent", "salary", "org"].includes(sort))
    throw new InvalidCatalogRequest("Ordenação inválida.");
  const page = params.get("page") ?? "1";
  if (!/^\d{1,7}$/.test(page) || Number(page) < 1)
    throw new InvalidCatalogRequest("Página inválida.");
  let ids: string[] | undefined;
  if (params.has("ids")) {
    ids = params.get("ids")?.split(",").filter(Boolean) ?? [];
    if (
      ids.length > 200 ||
      ids.some((id) => !/^[a-z0-9][a-z0-9-]{0,99}$/.test(id))
    )
      throw new InvalidCatalogRequest("Lista de favoritos inválida.");
    ids = [...new Set(ids)];
  }
  return {
    filters,
    sort: sort as CatalogRequest["sort"],
    page: Number(page),
    ids,
  };
}

export function catalogParams(request: CatalogRequest) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(request.filters))
    if (value) params.set(key, value);
  params.set("page", String(request.page));
  params.set("sort", request.sort);
  if (request.ids) params.set("ids", request.ids.join(","));
  return params;
}
