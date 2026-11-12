import type { Query } from "../src/lib/catalog-db/database";
import { notices } from "../src/data/notices";
import { opportunities, reviewDate } from "../src/data/opportunities";
import { stateNames } from "../src/data/locations";

export async function seedCatalog(query: Query) {
  const reviewedOn = reviewDate.split("/").reverse().join("-");
  const orgId = (name: string) =>
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  await query(
    `INSERT INTO radar_states(code,name) SELECT key,value FROM jsonb_each_text($1::jsonb) ON CONFLICT DO NOTHING`,
    [JSON.stringify(stateNames)],
  );
  await query(
    `INSERT INTO radar_organizations(id,name) SELECT id,name FROM jsonb_to_recordset($1::jsonb) AS x(id text,name text) ON CONFLICT DO NOTHING`,
    [
      JSON.stringify(
        [...new Set(Object.values(notices).map((notice) => notice.org))].map(
          (name) => ({ id: orgId(name), name }),
        ),
      ),
    ],
  );
  const noticeRows = Object.entries(notices).map(([id, notice]) => ({
    id,
    organization_id: orgId(notice.org),
    title: notice.title,
    source_label: notice.source.label,
    source_url: notice.source.url,
    requirements_source_label:
      "requirementsSource" in notice ? notice.requirementsSource.label : null,
    requirements_source_url:
      "requirementsSource" in notice ? notice.requirementsSource.url : null,
  }));
  await query(
    `INSERT INTO radar_notices(id,organization_id,title,source_label,source_url,requirements_source_label,requirements_source_url,review_status,reviewed_on)
    SELECT id,organization_id,title,source_label,source_url,requirements_source_label,requirements_source_url,'approved',$2::date
    FROM jsonb_to_recordset($1::jsonb) AS x(id text,organization_id text,title text,source_label text,source_url text,requirements_source_label text,requirements_source_url text)
    ON CONFLICT DO NOTHING`,
    [JSON.stringify(noticeRows), reviewedOn],
  );
  const records = opportunities.map((item) => ({
    id: item.id,
    notice_id: item.noticeId,
    role: item.role,
    kind: item.kind,
    professional_area: item.professionalArea,
    specialty: item.specialty,
    salary: item.salary,
    salary_label: item.salaryLabel,
    board: item.board,
    requirement: item.requirement,
    eligibility: item.eligibility,
    start_date: item.start ?? null,
    start_time: item.startHour ?? null,
    end_date: item.end ?? null,
    end_time: item.endHour ?? null,
    stage: item.stage,
    exam_location: item.examLocation ?? null,
    note: item.note ?? null,
  }));
  const added = await query(
    `INSERT INTO radar_opportunities(id,notice_id,role,kind,professional_area,specialty,salary,salary_label,board,requirement,eligibility,start_date,start_time,end_date,end_time,stage,exam_location,note,review_status,reviewed_on)
    SELECT id,notice_id,role,kind,professional_area,specialty,salary,salary_label,board,requirement,eligibility,start_date,start_time,end_date,end_time,stage,exam_location,note,'approved',$2::date
    FROM jsonb_to_recordset($1::jsonb) AS x(id text,notice_id text,role text,kind text,professional_area text,specialty text,salary numeric,salary_label text,board text,requirement text,eligibility text,start_date date,start_time time,end_date date,end_time time,stage text,exam_location text,note text)
    ON CONFLICT DO NOTHING RETURNING id`,
    [JSON.stringify(records), reviewedOn],
  );
  const ids = new Set(added.map((row) => row.id));
  const locations = opportunities
    .filter((item) => ids.has(item.id))
    .flatMap((item) =>
      item.locations.map((location, position) => ({
        opportunity_id: item.id,
        position,
        state: location.state,
        municipality_id: location.municipality?.id ?? null,
        municipality_name: location.municipality?.name ?? null,
        tentative: !!location.tentative,
        reserve_only: !!location.reserveOnly,
      })),
    );
  await query(
    `INSERT INTO radar_opportunity_locations SELECT * FROM jsonb_to_recordset($1::jsonb) AS x(opportunity_id text,position integer,state text,municipality_id integer,municipality_name text,tentative boolean,reserve_only boolean) ON CONFLICT DO NOTHING`,
    [JSON.stringify(locations)],
  );
  const amendments = Object.entries(notices).flatMap(([notice_id, notice]) =>
    Object.entries("amendments" in notice ? notice.amendments : {}).map(
      ([id, amendment]) => ({
        notice_id,
        id,
        published_on: amendment.date,
        title: amendment.title,
        source_label: amendment.source.label,
        source_url: amendment.source.url,
        changes: amendment.changes,
      }),
    ),
  );
  await query(
    `INSERT INTO radar_amendments(notice_id,id,published_on,title,source_label,source_url,changes,review_status)
    SELECT notice_id,id,published_on,title,source_label,source_url,changes,'approved' FROM jsonb_to_recordset($1::jsonb) AS x(notice_id text,id text,published_on date,title text,source_label text,source_url text,changes jsonb) ON CONFLICT DO NOTHING`,
    [JSON.stringify(amendments)],
  );
  return added.length;
}
