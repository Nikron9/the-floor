"use client";

import { useEffect, useState } from "react";

import FloorPageLayout from "../components/FloorPageLayout";
import {
  THEME_LABELS,
  THEME_STORAGE_KEY,
  applyTheme,
  readThemeChoice,
  resolveTheme,
  type ThemeChoice,
} from "../theme";

/** Settings that live in this browser: for now the colour theme. */
export default function SettingsPage() {
  const [choice, setChoice] = useState<ThemeChoice>("auto");

  useEffect(() => {
    setChoice(readThemeChoice());
  }, []);

  const choose = (next: ThemeChoice) => {
    setChoice(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not remembered, but applied for this visit.
    }
    applyTheme(resolveTheme(next));
  };

  const active = resolveTheme(choice);

  return (
    <FloorPageLayout back={{ fallback: "/" }}>
      <div className="w-full max-w-2xl mx-auto px-6 pt-4 pb-16 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold uppercase tracking-wide glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Ustawienia
          </h1>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/70">
            Zapisywane w tej przeglądarce
          </p>
        </div>

        <section className="neon-panel p-5 flex flex-col gap-4">
          <h2 className="text-xl font-bold uppercase tracking-wide text-white">Motyw kolorów</h2>
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Motyw kolorów">
            {(Object.keys(THEME_LABELS) as ThemeChoice[]).map((option) => (
              <label
                key={option}
                className="flex items-start gap-3 cursor-pointer select-none text-white"
              >
                <input
                  type="radio"
                  name="theme"
                  value={option}
                  checked={choice === option}
                  onChange={() => choose(option)}
                  className="mt-1 w-5 h-5 accent-[var(--color-neon)]"
                />
                <span className="flex flex-col">
                  <span className="font-semibold">{THEME_LABELS[option]}</span>
                  {option === "auto" && (
                    <span className="text-sm text-white/60">
                      Halloween od 15 października do 15 listopada, poza tym klasyczny.
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
          <p className="text-sm text-white/60">
            Teraz: <span className="font-semibold text-white">{THEME_LABELS[active]}</span>. Okno
            rzutnika w tej samej przeglądarce zmieni się od razu.
          </p>
        </section>
      </div>
    </FloorPageLayout>
  );
}
