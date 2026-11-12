import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Query } from "../src/lib/catalog-db/database";

// The caller wraps migrations and seed in one transaction.
export async function migrate(query: Query) {
  await query("SELECT pg_advisory_xact_lock(726723817)");
  await query(
    "CREATE TABLE IF NOT EXISTS radar_migrations(version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  const folder = resolve(process.cwd(), "db/migrations");
  for (const file of (await readdir(folder))
    .filter((name) => /^\d+_[a-z_]+\.sql$/.test(name))
    .sort()) {
    if (
      (
        await query("SELECT version FROM radar_migrations WHERE version=$1", [
          file,
        ])
      ).length
    )
      continue;
    await query(await readFile(resolve(folder, file), "utf8"));
    await query("INSERT INTO radar_migrations(version) VALUES($1)", [file]);
  }
}
