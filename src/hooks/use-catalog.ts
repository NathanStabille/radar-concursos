"use client";

import { useEffect, useRef, useState } from "react";
import {
  catalogParams,
  initialRequest,
  type CatalogRequest,
} from "@/lib/catalog-db/request";
import type { CatalogResponse } from "@/types/catalog";

export function useCatalog(
  request: CatalogRequest,
  now: string,
  initial: CatalogResponse | null,
) {
  const params = catalogParams(request).toString();
  const [reload, setReload] = useState(0);
  const key = `${params}|${now}|${reload}`;
  const first = useRef(true);
  const [state, setState] = useState({
    key: initial ? `${catalogParams(initialRequest)}|${now}|0` : "",
    data: initial,
    error: "",
    loading: !initial,
  });
  useEffect(() => {
    if (
      first.current &&
      initial &&
      params === catalogParams(initialRequest).toString()
    ) {
      first.current = false;
      return;
    }
    first.current = false;
    const controller = new AbortController();
    setState((current) => ({ ...current, key, error: "", loading: true }));
    const timer = window.setTimeout(
      async () => {
        try {
          const response = await fetch(`/api/opportunities?${params}`, {
            cache: "no-store",
            signal: controller.signal,
          });
          if (!response.ok)
            throw new Error(
              "Não foi possível carregar as oportunidades. Tente novamente.",
            );
          const data = (await response.json()) as CatalogResponse;
          if (!controller.signal.aborted)
            setState({ key, data, error: "", loading: false });
        } catch (error) {
          if (!controller.signal.aborted)
            setState((current) => ({
              ...current,
              key,
              error:
                error instanceof Error
                  ? error.message
                  : "Consulta indisponível.",
              loading: false,
            }));
        }
      },
      request.filters.search ? 250 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [params, now, reload]); // Every request owns its abort signal; older results cannot replace new filters.
  return {
    data: state.data,
    loading: state.key !== key || state.loading,
    error: state.key === key ? state.error : "",
    refresh: () => setReload((value) => value + 1),
  };
}
