import { databaseQuery, type Query } from "./database";
import { readCatalog, readHistory } from "./repository";
import type { CatalogRequest } from "./request";
import type { CatalogResponse } from "@/types/catalog";
import {
  createCatalogFacets,
  filterOpportunities,
  localDateTime,
  status,
} from "@/lib/catalog";
import { paginate } from "@/lib/pagination";
import { getAmendmentHistory } from "@/lib/amendments";

export async function queryHistory(query: Query | null = databaseQuery()) {
  if (query) return readHistory(query);
  const { notices } = await import("@/data/notices");
  return getAmendmentHistory(notices);
}

export async function queryCatalog(
  request: CatalogRequest,
  now = localDateTime(),
  query: Query | null = databaseQuery(),
): Promise<CatalogResponse> {
  if (query) return readCatalog(query, request, now);
  const { opportunities, reviewDate } = await import("@/data/opportunities");
  const filtered = filterOpportunities(
    opportunities,
    request.filters,
    request.sort,
    now,
    request.ids,
  );
  const pagination = paginate(filtered, request.page);
  const facets = createCatalogFacets(opportunities);
  return {
    ...pagination,
    total: filtered.length,
    facets,
    source: "initial",
    summary: {
      total: opportunities.length,
      open: opportunities.filter((item) => status(item, now) === "open").length,
      areaCount: facets.areas.length,
      stateCount: new Set(
        opportunities.flatMap((item) =>
          item.locations.map((location) => location.state),
        ),
      ).size,
      amendmentCount: (await queryHistory(null)).length,
      reviewedOn: reviewDate.split("/").reverse().join("-"),
    },
  };
}
