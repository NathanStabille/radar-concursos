import { test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "../scripts/migrate";
import { seedCatalog } from "../scripts/seed";
import { queryCatalog, queryHistory } from "../src/lib/catalog-db/service";
import { readCatalog } from "../src/lib/catalog-db/repository";
import {
  parseCatalogRequest,
  initialRequest,
  catalogParams,
} from "../src/lib/catalog-db/request";
import { opportunities } from "../src/data/opportunities";
import {
  initialFilters,
  filterOpportunities,
  status,
} from "../src/lib/catalog";
import type { Query } from "../src/lib/catalog-db/database";

test("migration, publication rules and catalog queries run against PostgreSQL", async () => {
  const db = new PGlite();
  const query: Query = async (text, values = []) =>
    values.length
      ? (await db.query<Record<string, unknown>>(text, values)).rows
      : (await db.exec(text)).flatMap(
          (result) => result.rows as Record<string, unknown>[],
        );
  const now = "2026-11-12T12:00";
  try {
    await db.transaction(async (tx) => {
      const execute: Query = async (text, values = []) =>
        values.length
          ? (await tx.query<Record<string, unknown>>(text, values)).rows
          : (await tx.exec(text)).flatMap(
              (result) => result.rows as Record<string, unknown>[],
            );
      await migrate(execute);
      assert.equal(await seedCatalog(execute), 35);
    });
    const first = await queryCatalog(initialRequest, now, query);
    assert.equal(first.source, "database");
    assert.equal(first.total, 35);
    assert.equal(first.items.length, 8);
    assert.equal(first.summary.areaCount, 10);
    assert.equal(first.summary.stateCount, 7);
    assert.deepEqual(
      new Set(first.facets.areas.map((item) => item.name)),
      new Set(opportunities.map((item) => item.professionalArea)),
    );
    const all = [];
    for (let page = 1; page <= first.totalPages; page++)
      all.push(
        ...(await queryCatalog({ ...initialRequest, page }, now, query)).items,
      );
    assert.equal(new Set(all.map((item) => item.id)).size, 35);
    for (const item of all)
      assert.deepEqual(
        item,
        JSON.parse(
          JSON.stringify(opportunities.find((seed) => seed.id === item.id)),
        ),
      );
    const history = await queryHistory(query);
    assert.equal(history.length, 5);
    assert.equal(first.summary.amendmentCount, history.length);

    const cases = [
      { search: "contabeis" },
      { search: "%" },
      { search: "_" },
      { search: "' OR 1=1 --" },
      { state: "SP" },
      { professionalArea: "Saúde" },
      { professionalArea: "Tecnologia da Informação", specialty: "Dados" },
      { salary: "low" },
      { salary: "mid" },
      { salary: "high" },
      { salary: "unknown" },
      { state: "RJ", municipality: "3304557" },
      { state: "SP", municipality: "3304557" },
      { state: "AC" },
      { status: "open" },
      { status: "closed" },
      { status: "ongoing" },
      { status: "finished" },
      { status: "unknown" },
    ];
    for (const input of cases) {
      const filters = { ...initialFilters, ...input };
      const actual = await readCatalog(
        query,
        { ...initialRequest, filters },
        now,
      );
      const expected = filterOpportunities(
        opportunities,
        filters,
        "recent",
        now,
      );
      assert.equal(actual.total, expected.length, JSON.stringify(input));
      assert.deepEqual(
        new Set(actual.items.map((item) => item.id)),
        new Set(expected.slice(0, 8).map((item) => item.id)),
        JSON.stringify(input),
      );
    }
    const saved = [all[0].id, all[12].id];
    assert.equal(
      (await readCatalog(query, { ...initialRequest, ids: saved }, now)).total,
      2,
    );
    assert.equal(
      (await readCatalog(query, { ...initialRequest, ids: [] }, now)).total,
      0,
    );
    assert.equal(
      (await readCatalog(query, { ...initialRequest, page: 999 }, now)).page,
      5,
    );
    const salary = await readCatalog(
      query,
      { ...initialRequest, sort: "salary" },
      now,
    );
    assert.equal(salary.items[0].id, "cremerj-auditor");

    await query(
      "UPDATE radar_opportunities SET role='Cargo atualizado sem deploy',end_date='2026-12-31' WHERE id=$1",
      [saved[0]],
    );
    const changed = await readCatalog(
      query,
      { ...initialRequest, ids: [saved[0]] },
      now,
    );
    assert.equal(changed.items[0].role, "Cargo atualizado sem deploy");
    assert.equal(changed.items[0].end, "2026-12-31");
    await db.transaction(async (tx) => {
      const execute: Query = async (text, values = []) =>
        values.length
          ? (await tx.query<Record<string, unknown>>(text, values)).rows
          : (await tx.exec(text)).flatMap(
              (result) => result.rows as Record<string, unknown>[],
            );
      await migrate(execute);
      assert.equal(await seedCatalog(execute), 0);
    });
    assert.equal(
      (await readCatalog(query, { ...initialRequest, ids: [saved[0]] }, now))
        .items[0].role,
      "Cargo atualizado sem deploy",
    );
    await query(
      "UPDATE radar_opportunities SET review_status='pending' WHERE id=$1",
      [saved[0]],
    );
    assert.equal(
      (await readCatalog(query, { ...initialRequest, ids: [saved[0]] }, now))
        .total,
      0,
    );
    await query(
      "UPDATE radar_notices SET review_status='pending' WHERE id='cremerj-01-2026'",
    );
    const hidden = await readCatalog(query, initialRequest, now);
    assert(hidden.items.every((item) => item.noticeId !== "cremerj-01-2026"));
    assert(
      (await queryHistory(query)).every(
        (entry) => entry.noticeId !== "cremerj-01-2026",
      ),
    );

    // SQL and browser status rules must agree at registration boundaries.
    const item = opportunities.find((item) => item.id === "cremerj-dev")!;
    for (const clock of [
      "2026-09-23T15:59",
      "2026-09-23T16:00",
      "2026-11-06T15:59",
      "2026-11-06T16:00",
    ]) {
      const [row] = await query(
        "SELECT radar_status($1::date,$2::time,$3::date,$4::time,$5,$6::timestamp) AS status",
        [
          item.start!,
          item.startHour!,
          item.end!,
          item.endHour!,
          item.stage,
          clock,
        ],
      );
      assert.equal(row.status, status(item, clock));
    }

    // Records absent from the seed must work through the same public contract.
    await query(
      "INSERT INTO radar_organizations(id,name) VALUES ('test-org','Órgão de teste')",
    );
    await query(`INSERT INTO radar_notices(id,organization_id,title,source_label,source_url)
      VALUES ('test-notice','test-org','Edital de teste','Fonte de teste','https://example.gov.br/edital')`);
    await query(`INSERT INTO radar_opportunities(id,notice_id,role,kind,professional_area,specialty,salary_label,board,requirement,eligibility,stage,review_status,reviewed_on)
      VALUES ('test-role','test-notice','Cargo de teste','Concurso público','Área nova','Especialidade nova','A confirmar','A confirmar','Requisito de teste','A confirmar','closed','approved','2026-11-12')`);
    await query(`INSERT INTO radar_opportunity_locations(opportunity_id,position,state,municipality_id,municipality_name)
      VALUES ('test-role',0,'AC',1200401,'Rio Branco')`);
    assert.equal(
      (await readCatalog(query, { ...initialRequest, ids: ["test-role"] }, now))
        .total,
      0,
    );
    await assert.rejects(
      query(
        "UPDATE radar_notices SET review_status='approved' WHERE id='test-notice'",
      ),
    );
    await query(
      "UPDATE radar_notices SET review_status='approved',reviewed_on='2026-11-12' WHERE id='test-notice'",
    );
    const added = await readCatalog(
      query,
      { ...initialRequest, ids: ["test-role"] },
      now,
    );
    assert.equal(added.total, 1);
    assert.equal(
      added.items[0].notice.source.url,
      "https://example.gov.br/edital",
    );
    assert.equal(added.items[0].salary, null);
    assert.equal(added.items[0].end, undefined);
    assert.equal(status(added.items[0], now), "unknown");
    assert(added.facets.areas.some((area) => area.name === "Área nova"));
    assert(added.facets.municipalities.some((city) => city.id === 1200401));
    assert.equal(added.summary.reviewedOn, "2026-11-12");
    await query(`INSERT INTO radar_amendments(notice_id,id,published_on,title,source_label,source_url,changes)
      VALUES ('test-notice','test-change','2026-11-12','Alteração de teste','Fonte de teste','https://example.gov.br/retificacao',
      '[{"category":"Prazo","field":"Inscrições","after":"A confirmar"}]'::jsonb)`);
    assert(
      !(await queryHistory(query)).some(
        (entry) => entry.noticeId === "test-notice",
      ),
    );
    await query(
      "UPDATE radar_amendments SET review_status='approved' WHERE notice_id='test-notice'",
    );
    assert(
      (await queryHistory(query)).some(
        (entry) => entry.noticeId === "test-notice",
      ),
    );
    await query("UPDATE radar_notices SET review_status='pending'");
    const empty = await readCatalog(query, initialRequest, now);
    assert.equal(empty.total, 0);
    assert.equal(empty.source, "database");
    assert.deepEqual(empty.items, []);
  } finally {
    await db.close();
  }
});

test("request validation rejects malformed filters and preserves favorite IDs", () => {
  for (const query of [
    "state=__proto__",
    "state=XX",
    "status=toString",
    "municipality=1",
    "salary=other",
    "sort=salary;DROP TABLE x",
    "page=-1",
    "page=1.5",
    "search=%00",
    "ids=x'--",
    "sort=org&sort=salary",
    "page=1&page=2",
    "ids=a&ids=b",
  ])
    assert.throws(() => parseCatalogRequest(new URLSearchParams(query)), query);
  const request = parseCatalogRequest(
    new URLSearchParams(
      "professionalArea=Saúde&ids=cremerj-dev,ufrrj-veterinario&page=2",
    ),
  );
  assert.deepEqual(parseCatalogRequest(catalogParams(request)), request);
});

test("unconfigured environments expose the explicit initial catalog", async () => {
  const response = await queryCatalog(initialRequest, "2026-11-12T12:00", null);
  assert.equal(response.source, "initial");
  assert.equal(response.total, 35);
  assert.equal(response.items.length, 8);
});

test("database failures propagate instead of presenting outdated seed data", async () => {
  const unavailable: Query = async () => {
    throw new Error("Database unavailable");
  };
  await assert.rejects(
    queryCatalog(initialRequest, "2026-11-12T12:00", unavailable),
    /Database unavailable/,
  );
  await assert.rejects(queryHistory(unavailable), /Database unavailable/);
});
