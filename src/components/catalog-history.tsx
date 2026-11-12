"use client";
import { useEffect, useState } from "react";
import type { AmendmentHistoryEntry, ChangeCategory } from "@/types/catalog";
import { Timeline } from "./timeline";

export function CatalogHistory({
  category,
}: {
  category: ChangeCategory | "";
}) {
  const [state, setState] = useState<{
    entries: AmendmentHistoryEntry[];
    loading: boolean;
    error: boolean;
  }>({ entries: [], loading: true, error: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ entries: [], loading: true, error: false });
    async function load() {
      try {
        const response = await fetch(
          `/api/catalog/history?${new URLSearchParams({ category })}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) throw new Error();
        const { entries } = (await response.json()) as {
          entries: AmendmentHistoryEntry[];
        };
        if (!controller.signal.aborted)
          setState({ entries, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted)
          setState({ entries: [], loading: false, error: true });
      }
    }
    void load();
    return () => controller.abort();
  }, [category, retry]);
  if (state.loading)
    return (
      <p role="status" className="catalog-feedback">
        Carregando histórico…
      </p>
    );
  if (state.error)
    return (
      <div className="catalog-feedback" role="alert">
        <p>Não foi possível carregar o histórico.</p>
        <button
          className="outline"
          onClick={() => setRetry((value) => value + 1)}
        >
          Tentar novamente
        </button>
      </div>
    );
  return <Timeline entries={state.entries} />;
}
