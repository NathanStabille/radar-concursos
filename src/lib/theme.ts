export type Theme = "light" | "dark";

export const themeStorageKey = "radar-concursos-theme";

// Runs in the document head so the saved theme is applied before the first paint.
export const themeInitScript = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(themeStorageKey)}); } catch {}
  const theme = saved === "light" || saved === "dark"
    ? saved
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(themeStorageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}
