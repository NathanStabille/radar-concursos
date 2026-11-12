import postgres from "postgres";

export type Query = (
  text: string,
  values?: string[],
) => Promise<Record<string, unknown>[]>;
let connection: ReturnType<typeof postgres> | undefined;

export function getConnection(url = process.env.DATABASE_URL) {
  if (!url) return null;
  connection ??= postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 8,
    prepare: false,
  });
  return connection;
}

export function databaseQuery(): Query | null {
  const sql = getConnection();
  return sql
    ? async (text, values = []) =>
        Array.from(
          await (values.length ? sql.unsafe(text, values) : sql.unsafe(text)),
        )
    : null;
}
