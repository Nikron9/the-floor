"use client";

import { useEffect } from "react";

import { THEME_STORAGE_KEY, applyTheme, readThemeChoice, resolveTheme } from "../theme";

/**
 * Keeps other windows (the projector) in step when the theme is changed in
 * settings, re-checks the season once an hour for the automatic choice, and
 * restores the theme if a full client re-render drops it.
 */
export default function ThemeSync() {
  useEffect(() => {
    const sync = () => applyTheme(resolveTheme(readThemeChoice()));
    // If React has to re-render the whole document (a hydration mismatch on
    // some page), it recreates <html> without the attribute the boot script
    // set. Put it back straight away.
    sync();
    const observer = new MutationObserver(() => {
      if (!document.documentElement.dataset.theme) sync();
    });
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"], attributes: true });
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(sync, 60 * 60 * 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);
  return null;
}
