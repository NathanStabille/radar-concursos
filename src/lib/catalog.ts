import { opportunities, type Opportunity } from "@/data/opportunities";

export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const statusNames = {
  open: "Inscrições abertas",
  upcoming: "Inscrições futuras",
  ongoing: "Em andamento",
  closed: "Inscrições encerradas",
  finished: "Homologado",
  unknown: "Situação não confirmada",
};
export const initialFilters = {
  search: "",
  city: "",
  area: "",
  salary: "",
  status: "",
};
const localClock = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
  hourCycle: "h23",
});

export function localDateTime() {
  return localClock.format().replace(" ", "T");
}

export function date(value: string) {
  return value.split("-").reverse().join("/");
}

export function period(item: Opportunity) {
  if (item.start && item.end)
    return (
      date(item.start) +
      " a " +
      date(item.end) +
      (item.endHour ? ", " + item.endHour : "")
    );
  return item.end ? "Até " + date(item.end) : "Período não confirmado";
}

export function status(item: Opportunity, now: string) {
  if (!item.end) return "unknown";
  if (item.start && now < item.start + "T" + (item.startHour ?? "00:00"))
    return "upcoming";
  const deadline = item.end + "T" + (item.endHour ?? "23:59");
  if (now < deadline || (now === deadline && !item.endHour))
    return item.start ? "open" : "unknown";
  return item.stage;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function options(key: "city" | "area") {
  return [
    ...new Set(
      opportunities.flatMap((item) =>
        key === "city" ? item.cities : [item.area],
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export const changes = opportunities
  .flatMap((item) => item.changes)
  .filter(
    (change, index, all) =>
      all.findIndex((other) => other.id === change.id) === index,
  )
  .sort((a, b) => b.date.localeCompare(a.date));

export function filterOpportunities(
  filters: typeof initialFilters,
  sort: string,
  today: string,
  favoriteIds?: string[],
) {
  return opportunities
    .filter((item) => {
      if (favoriteIds && !favoriteIds.includes(item.id)) return false;
      if (
        filters.search &&
        !normalize(
          [
            item.org,
            item.role,
            item.city,
            ...item.cities,
            item.area,
            item.board,
            item.requirement,
          ].join(" "),
        ).includes(normalize(filters.search.trim()))
      )
        return false;
      if (filters.city && !item.cities.includes(filters.city)) return false;
      if (filters.area && filters.area !== item.area) return false;
      if (filters.status && filters.status !== status(item, today))
        return false;
      if (filters.salary === "unknown") return item.salary === null;
      if (!filters.salary) return true;
      if (item.salary === null) return false;
      if (filters.salary === "low") return item.salary < 8000;
      if (filters.salary === "mid")
        return item.salary >= 8000 && item.salary < 10000;
      return item.salary >= 10000;
    })
    .sort((a, b) => {
      if (sort === "salary") return (b.salary ?? -1) - (a.salary ?? -1);
      if (sort === "org") return a.org.localeCompare(b.org, "pt-BR");
      return (b.end ?? "").localeCompare(a.end ?? "");
    });
}
