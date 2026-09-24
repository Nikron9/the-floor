"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

import type { CuratedOverrides } from "./registry";

/**
 * Picture replacements for the built-in categories.
 *
 * Fetched once per page load and kept in localStorage, which presenter and
 * projector already share: both windows resolve the same pictures, and a game
 * started offline or with the database down falls back to the last known set
 * (or to the shipped files if there never was one).
 */
const STORAGE_KEY = "the-floor-curated-overrides";

const EMPTY: CuratedOverrides = Object.freeze({});

export function useCuratedOverrides(): CuratedOverrides {
  const [overrides, setOverrides] = useLocalStorage<CuratedOverrides>(
    STORAGE_KEY,
    EMPTY,
    { initializeWithValue: false }
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/curated/overrides", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((body) => {
        if (!cancelled && body?.overrides && typeof body.overrides === "object") {
          const next = body.overrides as CuratedOverrides;
          // Keep the old object when nothing changed, so a round in progress
          // doesn't see a "new" example list and redo its preloading.
          setOverrides((previous) =>
            JSON.stringify(previous) === JSON.stringify(next) ? previous : next
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [setOverrides]);

  return overrides;
}
