"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CATEGORY_SORT_LABELS,
  DEFAULT_VIEW_OPTIONS,
  DIFFICULTY_INFO,
  arrangeCategories,
  catalogEntry,
  type CategorySort,
  type CategoryViewOptions,
} from "./catalog";

const STORAGE_KEY = "the-floor:category-view";

/**
 * Grouping, difficulty and sort settings shared by every category list. They
 * are remembered per browser; storage may be unavailable, so every access is
 * guarded and the defaults always work.
 */
export const useCategoryViewOptions = () => {
  const [options, setOptions] = useState<CategoryViewOptions>(DEFAULT_VIEW_OPTIONS);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setOptions({ ...DEFAULT_VIEW_OPTIONS, ...JSON.parse(saved) });
    } catch {
      // Keep the defaults.
    }
  }, []);

  const update = (patch: Partial<CategoryViewOptions>) =>
    setOptions((current) => {
      const next = { ...current, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Not remembered, but still applied.
      }
      return next;
    });

  return [options, update] as const;
};

const Toggle = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) => (
  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="w-5 h-5 accent-[var(--color-neon)]"
    />
    {children}
  </label>
);

export const CategoryViewControls = ({
  options,
  onChange,
}: {
  options: CategoryViewOptions;
  onChange: (patch: Partial<CategoryViewOptions>) => void;
}) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
    <Toggle checked={options.grouped} onChange={(grouped) => onChange({ grouped })}>
      Grupuj
    </Toggle>
    <Toggle
      checked={options.showDifficulty}
      onChange={(showDifficulty) => onChange({ showDifficulty })}
    >
      Pokaż trudność
    </Toggle>
    <label className="flex items-center gap-2 text-sm text-white/80">
      Sortuj:
      <select
        value={options.sort}
        onChange={(event) => onChange({ sort: event.target.value as CategorySort })}
        className="bg-gray-900 text-white px-2 py-1 rounded-md border border-neon focus:outline-none"
      >
        {(Object.keys(CATEGORY_SORT_LABELS) as CategorySort[]).map((sort) => (
          <option key={sort} value={sort}>
            {CATEGORY_SORT_LABELS[sort]}
          </option>
        ))}
      </select>
    </label>
    {options.showDifficulty && (
      <span className="text-xs text-white/60">
        {([1, 2, 3] as const)
          .map((level) => `${DIFFICULTY_INFO[level].emoji} ${DIFFICULTY_INFO[level].label}`)
          .join("   ")}
      </span>
    )}
  </div>
);

/** The difficulty emoji for a category, or nothing if it has none. */
export const DifficultyMark = ({ id }: { id: string }) => {
  const difficulty = catalogEntry(id)?.difficulty;
  if (!difficulty) return null;
  const { emoji, label } = DIFFICULTY_INFO[difficulty];
  return (
    <span title={`Trudność: ${label}`} aria-label={`Trudność: ${label}`}>
      {emoji}
    </span>
  );
};

/** Renders categories as one grid, or one titled grid per group. */
export const CategorySections = <T extends { id: string; name: string }>({
  items,
  options,
  gridClassName,
  renderTile,
}: {
  items: T[];
  options: CategoryViewOptions;
  gridClassName: string;
  renderTile: (item: T) => ReactNode;
}) => (
  <div className="flex flex-col gap-8">
    {arrangeCategories(items, options).map(({ group, items: sectionItems }) => (
      <section key={group?.id ?? "all"} className="flex flex-col gap-3">
        {group && (
          <h2 className="text-xl font-bold uppercase tracking-wide text-white">
            <span className="mr-2">{group.emoji}</span>
            {group.label}
          </h2>
        )}
        <div className={gridClassName}>{sectionItems.map(renderTile)}</div>
      </section>
    ))}
  </div>
);
