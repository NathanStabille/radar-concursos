import type { WorkLocation } from "@/data/locations";

export const changeCategories = [
  "Prazo",
  "Escolaridade",
  "Remuneração",
] as const;
export type ChangeCategory = (typeof changeCategories)[number];
export type NoticeSource = { label: string; url: string };
export type NoticeChange = {
  category: ChangeCategory;
  field: string;
  before?: string;
  after: string;
  context?: string;
  opportunityIds?: string[];
};
export type Amendment = {
  date: string;
  title: string;
  source: NoticeSource;
  changes: NoticeChange[];
};
export type Notice = {
  org: string;
  title: string;
  source: NoticeSource;
  requirementsSource?: NoticeSource;
  amendments?: Record<string, Amendment>;
};
export type OpportunityEntry = {
  id: string;
  noticeId: string;
  role: string;
  kind: "Concurso público" | "Seleção simplificada";
  professionalArea: string;
  specialty: string;
  locations: WorkLocation[];
  examLocation?: string;
  salary: number | null;
  salaryLabel: string;
  board: string;
  requirement: string;
  eligibility: string;
  start?: string;
  startHour?: string;
  end?: string;
  endHour?: string;
  stage: "ongoing" | "closed" | "finished";
  note?: string;
};
export type Opportunity = OpportunityEntry & { org: string; notice: Notice };
export type AmendmentHistoryEntry = Amendment & {
  id: string;
  noticeId: string;
  notice: Notice;
};
export type CatalogFacets = {
  areas: { name: string; count: number }[];
  specialties: { area: string; name: string }[];
  municipalities: { id: number; name: string; state: string }[];
};
export type CatalogSummary = {
  total: number;
  open: number;
  areaCount: number;
  stateCount: number;
  amendmentCount: number;
  reviewedOn: string | null;
};
export type CatalogResponse = {
  items: Opportunity[];
  total: number;
  page: number;
  totalPages: number;
  first: number;
  last: number;
  facets: CatalogFacets;
  summary: CatalogSummary;
  source: "database" | "initial";
};
