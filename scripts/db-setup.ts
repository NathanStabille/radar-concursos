import postgres from "postgres";
import { migrate } from "./migrate";
import { seedCatalog } from "./seed";
import type { Query } from "../src/lib/catalog-db/database";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url)
    throw new Error(
      "Defina DATABASE_URL no .env.local antes de executar npm run db:setup.",
    );
  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 });
  try {
    const added = await sql.begin(async (tx) => {
      const query: Query = async (text, values = []) =>
        Array.from(
          await (values.length ? tx.unsafe(text, values) : tx.unsafe(text)),
        );
      await migrate(query);
      return seedCatalog(query);
    });
    console.log(
      `Banco preparado. ${added} cargos iniciais adicionados; registros existentes preservados.`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}
main().catch((error) => {
  console.error(
    error instanceof Error && error.message.startsWith("Defina DATABASE_URL")
      ? error.message
      : "Não foi possível preparar o banco. Confira a conexão e as permissões do PostgreSQL.",
  );
  process.exitCode = 1;
});
