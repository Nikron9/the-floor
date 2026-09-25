/**
 * Colour themes. The palette lives in app/globals.css as CSS variables;
 * a theme is just `data-theme` on <html>. The choice is kept per browser, so
 * the presenter and the projector window (same browser) always match.
 *
 * "auto" follows the calendar: Halloween from 15 October to 15 November,
 * the classic look the rest of the year.
 */

export type ThemeChoice = "auto" | "classic" | "halloween";
export type Theme = "classic" | "halloween";

export const THEME_STORAGE_KEY = "the-floor:theme";

export const THEME_LABELS: Record<ThemeChoice, string> = {
  auto: "Automatycznie (sezonowo)",
  classic: "Klasyczny",
  halloween: "Halloween",
};

/** Halloween season: 15 October to 15 November, inclusive. */
export const isHalloweenSeason = (date: Date): boolean => {
  const month = date.getMonth(); // 0-based: 9 = October, 10 = November
  const day = date.getDate();
  return (month === 9 && day >= 15) || (month === 10 && day <= 15);
};

export const resolveTheme = (choice: ThemeChoice, date = new Date()): Theme =>
  choice === "auto" ? (isHalloweenSeason(date) ? "halloween" : "classic") : choice;

export const readThemeChoice = (): ThemeChoice => {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "classic" || saved === "halloween" || saved === "auto") return saved;
  } catch {
    // Storage unavailable: fall back to the seasonal default.
  }
  return "auto";
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

/**
 * Runs before the page paints (inlined in the layout), so a Halloween visit
 * never flashes blue first. Mirrors isHalloweenSeason/readThemeChoice.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var c=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})||"auto";var d=new Date(),m=d.getMonth(),n=d.getDate();var h=(m===9&&n>=15)||(m===10&&n<=15);document.documentElement.dataset.theme=c==="auto"?(h?"halloween":"classic"):c;}catch(e){document.documentElement.dataset.theme="classic";}})();`;
