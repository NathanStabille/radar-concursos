"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getStoredTheme, themeStorageKey, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const preference = useRef<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    // Keep a choice for this tab even when browser storage is blocked.
    preference.current = getStoredTheme();
    function apply(next: Theme) {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }
    function syncSystem() {
      if (!preference.current) apply(media.matches ? "dark" : "light");
    }
    function syncStorage(event: StorageEvent) {
      if (event.key !== themeStorageKey && event.key !== null) return;
      preference.current = getStoredTheme();
      apply(preference.current ?? (media.matches ? "dark" : "light"));
    }
    apply(preference.current ?? (media.matches ? "dark" : "light"));
    media.addEventListener("change", syncSystem);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", syncSystem);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    preference.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // The toggle remains usable without persistent browser storage.
    }
  }

  const label = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggle}
      disabled={theme === null}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
