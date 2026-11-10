import { stateNames, type WorkLocation } from "@/data/locations";
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
  state: "",
  municipality: "",
  professionalArea: "",
  specialty: "",
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

export function options(
  key: "professionalArea" | "specialty",
  professionalArea = "",
) {
  const matching = professionalArea
    ? opportunities.filter((item) => item.professionalArea === professionalArea)
    : opportunities;
  const values = matching.map((item) => item[key]);
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export const stateOptions = Object.entries(stateNames).sort(([, a], [, b]) =>
  a.localeCompare(b, "pt-BR"),
);

const workLocations = opportunities.flatMap((item) => item.locations);
export const coveredStateCount = new Set(
  workLocations.map(({ state }) => state),
).size;

export function municipalityOptions(state: string): [string, string][] {
  const cities = new Map<string, string>();
  for (const location of workLocations) {
    if (location.municipality && (!state || location.state === state)) {
      cities.set(String(location.municipality.id), municipalityLabel(location));
    }
  }
  return [...cities].sort(([, a], [, b]) => a.localeCompare(b, "pt-BR"));
}

export function matchingLocations(
  locations: WorkLocation[],
  {
    state,
    municipality,
  }: Pick<typeof initialFilters, "state" | "municipality">,
) {
  return locations.filter(
    (location) =>
      (!state || state === location.state) &&
      (!municipality || municipality === String(location.municipality?.id)),
  );
}

function municipalityLabel(location: WorkLocation) {
  return location.municipality
    ? `${location.municipality.name}/${location.state}`
    : location.state;
}

export function locationLabel(location: WorkLocation) {
  const label = municipalityLabel(location);
  if (!location.municipality) return `${label} · Município a confirmar`;
  if (location.tentative) return `${label} · Lotação possível`;
  if (location.reserveOnly) return `${label} · Cadastro de reserva`;
  return label;
}

export function locationSummary(locations: WorkLocation[]) {
  if (!locations.length) return "Lotação não confirmada";
  if (locations.length === 1) return locationLabel(locations[0]);
  const states = [...new Set(locations.map(({ state }) => state))];
  if (locations.every(({ tentative }) => tentative)) {
    return `Lotação a definir · ${states.join(", ")}`;
  }
  return states.length === 1
    ? `${locations.length} localidades · ${states[0]}`
    : `${locations.length} localidades em ${states.length} UFs`;
}

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
            ...item.locations.map(
              (location) =>
                `${municipalityLabel(location)} ${stateNames[location.state]}`,
            ),
            item.professionalArea,
            item.specialty,
            item.board,
            item.requirement,
          ].join(" "),
        ).includes(normalize(filters.search.trim()))
      )
        return false;
      if (
        (filters.state || filters.municipality) &&
        !matchingLocations(item.locations, filters).length
      )
        return false;
      if (
        filters.professionalArea &&
        filters.professionalArea !== item.professionalArea
      )
        return false;
      if (filters.specialty && filters.specialty !== item.specialty)
        return false;
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
