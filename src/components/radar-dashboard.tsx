"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  ChevronDown,
  GitCompareArrows,
  History,
  ListFilter,
  MapPin,
  Radar,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { changeCategories, type ChangeCategory } from "@/data/notices";
import { opportunities, reviewDate } from "@/data/opportunities";
import {
  coveredStateCount,
  filterOpportunities,
  initialFilters,
  professionalAreaOptions,
  matchingLocations,
  localDateTime,
  status,
} from "@/lib/catalog";
import { amendmentCount, getAmendmentHistory } from "@/lib/amendments";
import { CatalogFilters } from "./catalog-filters";
import { OfficialSearch } from "./official-search";
import { OpportunityCard } from "./opportunity-card";
import { RadarDialog, type Modal } from "./radar-dialog";
import { RadarHero } from "./radar-hero";
import { SourceMonitor } from "./source-monitor";
import { Timeline } from "./timeline";

const favoritesKey = "radar-ads-favorites-v1";

const tabs = [
  { id: "opportunities", label: "Oportunidades", icon: ListFilter },
  { id: "favorites", label: "Favoritos", icon: Bookmark },
  { id: "history", label: "Histórico", icon: History },
  { id: "official", label: "Busca oficial", icon: Search },
] as const;
type Tab = (typeof tabs)[number]["id"];

export function RadarDashboard({ initialTime }: { initialTime: string }) {
  const [tab, setTab] = useState<Tab>("opportunities");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("recent");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [today, setToday] = useState(initialTime);
  const [notice, setNotice] = useState("");
  const [historyCategory, setHistoryCategory] = useState<ChangeCategory | "">(
    "",
  );

  useEffect(() => {
    const updateDate = () => setToday(localDateTime());
    updateDate();
    const timer = window.setInterval(updateDate, 60000);
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(favoritesKey) || "[]",
      );
      if (Array.isArray(saved))
        setFavorites(
          saved.filter((id) => opportunities.some((item) => item.id === id)),
        );
    } catch {
      /* The site remains usable if storage is unavailable. */
    }
    return () => window.clearInterval(timer);
  }, []);

  function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((value) => value !== id)
      : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(next));
    } catch {
      setNotice("Favorito disponível apenas nesta sessão.");
    }
  }

  function toggleCompare(id: string) {
    setNotice("");
    if (selected.includes(id))
      setSelected(selected.filter((value) => value !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
    else setNotice("Você pode comparar até 3 oportunidades por vez.");
  }

  const activeFilters = Object.values(filters).filter(Boolean).length;
  const filtered = filterOpportunities(
    filters,
    sort,
    today,
    tab === "favorites" ? favorites : undefined,
  );

  const openCount = opportunities.filter(
    (item) => status(item, today) === "open",
  ).length;
  const compared = selected.flatMap((id) =>
    opportunities.filter((item) => item.id === id),
  );

  function setFilter(key: keyof typeof initialFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "professionalArea" && { specialty: "" }),
      ...(key === "state" && { municipality: "" }),
    }));
  }

  function navigate(next: Tab) {
    setTab(next);
    setFilters(initialFilters);
  }

  return (
    <>
      <header className="topbar">
        <div className="top-inner">
          <button
            className="brand"
            onClick={() => navigate("opportunities")}
            aria-label="Radar Concursos — início"
          >
            <span className="brand-icon">
              <Radar size={22} />
            </span>
            <span>
              Radar <strong>Concursos</strong>
              <small>BR</small>
            </span>
          </button>
          <div className="top-region">
            <MapPin size={15} /> Catálogo inicial · {coveredStateCount} UFs com
            registros
          </div>
          <button
            className="top-button"
            onClick={() => setModal({ type: "criteria" })}
          >
            <ShieldCheck size={17} /> <span>Critérios do radar</span>
          </button>
        </div>
      </header>

      <main className="shell">
        <RadarHero />

        <section className="summary" aria-label="Resumo da curadoria">
          <div className="summary-item">
            <span className="summary-icon">
              <Building2 size={20} />
            </span>
            <div>
              <strong>{String(opportunities.length).padStart(2, "0")}</strong>
              <span>Cargos em {professionalAreaOptions.length} áreas</span>
            </div>
          </div>
          <button
            className="summary-item"
            onClick={() => {
              navigate("opportunities");
              setFilters({ ...initialFilters, status: "open" });
            }}
          >
            <span className="summary-icon green">
              <CalendarDays size={20} />
            </span>
            <div>
              <strong>{String(openCount).padStart(2, "0")}</strong>
              <span>Inscrições abertas</span>
            </div>
            <ArrowRight className="summary-arrow" size={17} />
          </button>
          <button className="summary-item" onClick={() => navigate("history")}>
            <span className="summary-icon ochre">
              <History size={20} />
            </span>
            <div>
              <strong>{String(amendmentCount).padStart(2, "0")}</strong>
              <span>Publicações no histórico</span>
            </div>
            <ArrowRight className="summary-arrow" size={17} />
          </button>
        </section>

        <nav className="nav" aria-label="Seções do radar">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={17} />
              {label}
              {id === "favorites" && (
                <span className="count">{favorites.length}</span>
              )}
            </button>
          ))}
          <span className="review">
            <span></span> Catálogo atualizado em {reviewDate}
          </span>
        </nav>

        {tab === "official" ? (
          <>
            <OfficialSearch currentMonth={today.slice(0, 7)} />
            <SourceMonitor />
          </>
        ) : tab === "history" ? (
          <section className="main-section">
            <div className="section-heading">
              <div>
                <h2>Histórico de mudanças</h2>
                <p>Compare o antes e o depois de cada alteração publicada.</p>
              </div>
              <label className="select-wrap">
                <span className="sr-only">Tipo de mudança</span>
                <select
                  value={historyCategory}
                  onChange={(event) =>
                    setHistoryCategory(
                      event.target.value as ChangeCategory | "",
                    )
                  }
                >
                  <option value="">Todos os tipos</option>
                  {changeCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
            </div>
            <div className="history-panel">
              <Timeline
                entries={getAmendmentHistory({
                  category: historyCategory || undefined,
                })}
              />
            </div>
          </section>
        ) : (
          <section className="main-section">
            <div className="section-heading">
              <div>
                <h2>
                  {tab === "favorites" ? "Meus favoritos" : "Oportunidades"}
                </h2>
                <p>
                  {tab === "favorites"
                    ? "Os editais que você salvou neste navegador."
                    : "Consulte os cargos e confira a formação exigida no edital."}
                </p>
              </div>
              <button
                className="outline compare-top"
                onClick={() => setModal({ type: "compare" })}
                disabled={selected.length < 2}
              >
                <GitCompareArrows size={17} /> Comparar{" "}
                <span className="count">{selected.length}</span>
              </button>
            </div>
            {tab === "opportunities" && (
              <div className="catalog-coverage">
                <div>
                  <strong>
                    Explore as {professionalAreaOptions.length} áreas do
                    catálogo
                  </strong>
                  <p>
                    Cargos de nível médio, técnico e superior. A cobertura ainda
                    é parcial. As publicações coletadas aguardam conferência
                    antes de entrar nesta lista.
                  </p>
                </div>
                <button
                  className="outline"
                  onClick={() => navigate("official")}
                >
                  Ver novas publicações <ArrowRight size={16} />
                </button>
              </div>
            )}
            <CatalogFilters filters={filters} onChange={setFilter} />
            <div className="result-bar">
              <div aria-live="polite">
                <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1
                  ? "oportunidade encontrada"
                  : "oportunidades encontradas"}
                {activeFilters > 0 && (
                  <button
                    className="text-button"
                    onClick={() => setFilters(initialFilters)}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
              <label className="sort">
                <ArrowDownUp size={15} />
                <span className="sr-only">Ordenar oportunidades</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="recent">Prazo mais recente</option>
                  <option value="salary">Maior remuneração</option>
                  <option value="org">Órgão de A a Z</option>
                </select>
              </label>
            </div>
            {filtered.length ? (
              <div className="results">
                {filtered.map((item) => (
                  <OpportunityCard
                    key={item.id}
                    item={item}
                    locations={matchingLocations(item.locations, filters)}
                    today={today}
                    isSaved={favorites.includes(item.id)}
                    isSelected={selected.includes(item.id)}
                    onDetails={() => setModal({ type: "details", item })}
                    onFavorite={() => toggleFavorite(item.id)}
                    onCompare={() => toggleCompare(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty">
                <span className="summary-icon">
                  {tab === "favorites" && !activeFilters ? (
                    <Bookmark size={23} />
                  ) : (
                    <Search size={23} />
                  )}
                </span>
                <h3>
                  {tab === "favorites" && !activeFilters
                    ? "Seus favoritos aparecem aqui"
                    : "Nenhuma oportunidade com esses filtros"}
                </h3>
                <p>
                  {tab === "favorites" && !activeFilters
                    ? "Use o ícone de marcador para salvar um edital."
                    : filters.state
                      ? "A cobertura é parcial. Confira outras UFs ou limpe os filtros."
                      : "Experimente ampliar a busca ou limpar os filtros."}
                </p>
                <button
                  className="outline"
                  onClick={() =>
                    activeFilters
                      ? setFilters(initialFilters)
                      : navigate("opportunities")
                  }
                >
                  {activeFilters ? "Limpar filtros" : "Explorar oportunidades"}{" "}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </section>
        )}

        <footer>
          <span>
            <Radar size={17} /> Radar Concursos
          </span>
          <span>
            Curadoria independente · Confira os atos oficiais antes de se
            inscrever.
          </span>
        </footer>
      </main>

      {(selected.length > 0 || notice) && (
        <aside className="tray" aria-label="Seleção para comparação">
          <div aria-live="polite">
            <strong>{selected.length} de 3 selecionadas</strong>
            <span>
              {notice ||
                (selected.length < 2
                  ? "Escolha pelo menos 2 para comparar."
                  : "Compare remuneração, requisitos e prazos.")}
            </span>
          </div>
          <button
            className="icon-button"
            title="Limpar seleção"
            aria-label="Limpar seleção"
            onClick={() => {
              setSelected([]);
              setNotice("");
            }}
          >
            <X size={18} />
          </button>
          <button
            className="primary"
            disabled={selected.length < 2}
            onClick={() => setModal({ type: "compare" })}
          >
            Comparar <ArrowRight size={16} />
          </button>
        </aside>
      )}

      <RadarDialog
        modal={modal}
        compared={compared}
        today={today}
        onClose={() => setModal(null)}
      />
    </>
  );
}
