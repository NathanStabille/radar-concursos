import { RadarDashboard } from "@/components/radar-dashboard";
import { localDateTime } from "@/lib/catalog";
import { initialRequest } from "@/lib/catalog-db/request";
import { queryCatalog } from "@/lib/catalog-db/service";
export const dynamic = "force-dynamic";
export default async function Home() {
  const initialTime = localDateTime();
  const initialCatalog = await queryCatalog(initialRequest, initialTime).catch(
    () => null,
  );
  return (
    <RadarDashboard initialTime={initialTime} initialCatalog={initialCatalog} />
  );
}
