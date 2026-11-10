import { timingSafeEqual } from "node:crypto";
import { readSource } from "@/lib/official-notices/monitored-sources";
import { getMonitorStore } from "@/lib/official-notices/monitor-store";
import { sourceIds } from "@/lib/official-notices/monitor-types";

export const maxDuration = 25;

const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (
    !secret ||
    auth.length !== expected.length ||
    !timingSafeEqual(auth, expected)
  ) {
    return Response.json(
      { error: "Acesso não autorizado." },
      { status: 401, headers },
    );
  }

  const store = getMonitorStore();
  if (!store) {
    return Response.json(
      { error: "Armazenamento do monitoramento não configurado." },
      { status: 503, headers },
    );
  }

  const checkedAt = new Date().toISOString();
  const results = await Promise.all(
    sourceIds.map(async (source) => {
      const publications = await readSource[source]().catch(() => null);
      try {
        await store.record(source, checkedAt, publications);
        return {
          source,
          status: publications === null ? "unavailable" : "available",
        };
      } catch {
        return { source, status: "storage-error" };
      }
    }),
  );

  const success = results.some(({ status }) => status === "available");
  const storageError = results.some(({ status }) => status === "storage-error");
  return Response.json(
    { checkedAt, results },
    { status: storageError ? 503 : success ? 200 : 502, headers },
  );
}
