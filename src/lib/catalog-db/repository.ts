import type {
  CatalogResponse,
  CatalogFacets,
  CatalogSummary,
  Opportunity,
  AmendmentHistoryEntry,
} from "@/types/catalog";
import type { CatalogRequest } from "./request";
import type { Query } from "./database";
import { pageSize } from "@/lib/pagination";

export async function readCatalog(
  query: Query,
  request: CatalogRequest,
  now: string,
): Promise<CatalogResponse> {
  const values: string[] = [];
  const bind = (value: string) => {
    values.push(value);
    return `$${values.length}`;
  };
  const conditions: string[] = [];
  const f = request.filters;
  if (f.search)
    conditions.push(
      `position(radar_normalize(${bind(f.search)}) in c.search_text) > 0`,
    );
  if (f.professionalArea)
    conditions.push(`c.professional_area=${bind(f.professionalArea)}`);
  if (f.specialty) conditions.push(`c.specialty=${bind(f.specialty)}`);
  if (f.state || f.municipality) {
    const region = ["l.opportunity_id=c.id"];
    if (f.state) region.push(`l.state=${bind(f.state)}`);
    if (f.municipality)
      region.push(`l.municipality_id=${bind(f.municipality)}::integer`);
    conditions.push(
      `EXISTS (SELECT 1 FROM radar_opportunity_locations l WHERE ${region.join(" AND ")})`,
    );
  }
  if (f.status)
    conditions.push(
      `radar_status(c.start_date,c.start_time,c.end_date,c.end_time,c.stage,${bind(now)}::timestamp)=${bind(f.status)}`,
    );
  if (f.salary)
    conditions.push(
      {
        low: "c.salary < 8000",
        mid: "c.salary >= 8000 AND c.salary < 10000",
        high: "c.salary >= 10000",
        unknown: "c.salary IS NULL",
      }[f.salary]!,
    );
  if (request.ids)
    conditions.push(
      `c.id IN (SELECT jsonb_array_elements_text(${bind(JSON.stringify(request.ids))}::jsonb))`,
    );
  const requestedPage = bind(String(request.page));
  const order = {
    recent: "end_date DESC NULLS LAST, id ASC",
    salary: "salary DESC NULLS LAST, id ASC",
    org: "org ASC, id ASC",
  }[request.sort];
  const [page] = await query(
    `
    WITH matching AS (SELECT c.* FROM radar_catalog c WHERE ${conditions.join(" AND ") || "true"}),
    bounds AS (SELECT count(*)::integer AS total, greatest(1,ceil(count(*)::numeric/${pageSize}))::integer AS pages FROM matching)
    SELECT total, pages, least(${requestedPage}::integer,pages) AS page,
      coalesce((SELECT jsonb_agg(payload) FROM (
        SELECT payload FROM matching ORDER BY ${order} LIMIT ${pageSize}
        OFFSET (least(${requestedPage}::integer,pages)-1)*${pageSize}
      ) selected),'[]'::jsonb) AS items FROM bounds`,
    values,
  );

  const [metadata] = await query(
    `SELECT
    jsonb_build_object(
      'total',(SELECT count(*) FROM radar_catalog),
      'open',(SELECT count(*) FROM radar_catalog WHERE radar_status(start_date,start_time,end_date,end_time,stage,$1::timestamp)='open'),
      'areaCount',(SELECT count(DISTINCT professional_area) FROM radar_catalog),
      'stateCount',(SELECT count(DISTINCT l.state) FROM radar_opportunity_locations l JOIN radar_catalog c ON c.id=l.opportunity_id),
      'amendmentCount',(SELECT count(*) FROM radar_amendments a WHERE a.review_status='approved' AND EXISTS(SELECT 1 FROM radar_catalog c WHERE c.notice_id=a.notice_id)),
      'reviewedOn',(SELECT to_char(max(reviewed_on),'YYYY-MM-DD') FROM radar_catalog)
    ) AS summary,
    jsonb_build_object(
      'areas',coalesce((SELECT jsonb_agg(jsonb_build_object('name',name,'count',count) ORDER BY name) FROM
        (SELECT professional_area AS name,count(*)::integer AS count FROM radar_catalog GROUP BY professional_area) areas),'[]'::jsonb),
      'specialties',coalesce((SELECT jsonb_agg(jsonb_build_object('area',professional_area,'name',specialty) ORDER BY professional_area,specialty) FROM
        (SELECT DISTINCT professional_area,specialty FROM radar_catalog) specialties),'[]'::jsonb),
      'municipalities',coalesce((SELECT jsonb_agg(jsonb_build_object('id',municipality_id,'name',municipality_name,'state',state) ORDER BY municipality_name,state) FROM
        (SELECT DISTINCT l.municipality_id,l.municipality_name,l.state FROM radar_opportunity_locations l JOIN radar_catalog c ON c.id=l.opportunity_id WHERE l.municipality_id IS NOT NULL) cities),'[]'::jsonb)
    ) AS facets`,
    [now],
  );
  const current = Number(page.page),
    total = Number(page.total);
  return {
    items: page.items as Opportunity[],
    total,
    page: current,
    totalPages: Number(page.pages),
    first: total ? (current - 1) * pageSize + 1 : 0,
    last: Math.min(current * pageSize, total),
    facets: metadata.facets as CatalogFacets,
    summary: metadata.summary as CatalogSummary,
    source: "database",
  };
}

export async function readHistory(
  query: Query,
): Promise<AmendmentHistoryEntry[]> {
  const rows = await query(`SELECT DISTINCT ON (a.notice_id,a.id)
    jsonb_build_object('id',a.notice_id || '/' || a.id,'noticeId',a.notice_id,
      'notice',c.payload->'notice','date',to_char(a.published_on,'YYYY-MM-DD'),
      'title',a.title,'source',jsonb_build_object('label',a.source_label,'url',a.source_url),'changes',a.changes) AS payload
    FROM radar_amendments a JOIN radar_catalog c ON c.notice_id=a.notice_id
    WHERE a.review_status='approved' ORDER BY a.notice_id,a.id,c.id`);
  return rows
    .map((row) => row.payload as AmendmentHistoryEntry)
    .sort((a, b) => b.date.localeCompare(a.date));
}
