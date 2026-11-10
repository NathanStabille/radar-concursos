import { getMonitorStore } from "@/lib/official-notices/monitor-store";
import {
  sourceIds,
  type SourceReport,
} from "@/lib/official-notices/monitor-types";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  const store = getMonitorStore();
  if (!store) {
    return Response.json(
      { storage: "unconfigured", readings: {} } satisfies SourceReport,
      { headers },
    );
  }

  try {
    const readings: SourceReport["readings"] = {};
    await Promise.all(
      sourceIds.map(async (source) => {
        const reading = await store.read(source);
        if (reading) readings[source] = reading;
      }),
    );
    return Response.json(
      { storage: "ready", readings } satisfies SourceReport,
      { headers },
    );
  } catch {
    return Response.json(
      { storage: "unavailable", readings: {} } satisfies SourceReport,
      { status: 503, headers },
    );
  }
}
