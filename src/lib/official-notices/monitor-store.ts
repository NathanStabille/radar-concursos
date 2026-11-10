import type {
  SourceId,
  SourcePublication,
  SourceReading,
} from "./monitor-types";

export function getMonitorStore() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const endpoint = url;
  async function command<T>(args: string[]) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error("Armazenamento indisponível.");
    const data = (await response.json()) as { result?: T; error?: string };
    if (data.error || data.result === undefined)
      throw new Error("Resposta inválida do armazenamento.");
    return data.result;
  }

  const key = (source: SourceId) => `radar:official-source:v1:${source}`;

  return {
    async read(source: SourceId): Promise<SourceReading | null> {
      const [checkedAt, status, lastSuccessAt, storedPublications] =
        await command<(string | null)[]>([
          "HMGET",
          key(source),
          "checkedAt",
          "status",
          "lastSuccessAt",
          "publications",
        ]);
      if (!checkedAt || (status !== "available" && status !== "unavailable"))
        return null;
      return {
        checkedAt,
        status,
        lastSuccessAt,
        publications: storedPublications
          ? (JSON.parse(storedPublications) as SourcePublication[])
          : [],
      };
    },
    async record(
      source: SourceId,
      checkedAt: string,
      publications: SourcePublication[] | null,
    ) {
      await command([
        "EVAL",
        recordReading,
        "1",
        key(source),
        checkedAt,
        publications === null ? "unavailable" : "available",
        JSON.stringify(publications ?? []),
      ]);
    },
  };
}

// Datas ISO em UTC permitem comparar execuções concorrentes pela ordem de início.
const recordReading = `
local checkedAt = redis.call('HGET', KEYS[1], 'checkedAt')
if not checkedAt or ARGV[1] >= checkedAt then
  redis.call('HSET', KEYS[1], 'checkedAt', ARGV[1], 'status', ARGV[2])
end
if ARGV[2] == 'available' then
  local lastSuccessAt = redis.call('HGET', KEYS[1], 'lastSuccessAt')
  if not lastSuccessAt or ARGV[1] >= lastSuccessAt then
    redis.call('HSET', KEYS[1], 'lastSuccessAt', ARGV[1], 'publications', ARGV[3])
  end
end
return 1
`;
