import { RadarDashboard } from "@/components/radar-dashboard";
import { localDateTime } from "@/lib/catalog";

export default function Home() {
  return <RadarDashboard initialTime={localDateTime()} />;
}
