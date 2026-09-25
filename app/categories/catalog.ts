import type { Category } from "../data";

/**
 * How categories are organised when browsing or picking them: a thematic
 * group and a difficulty from 1 (easy) to 3 (hard). Labels are Polish UI
 * text. Every category must appear in CATEGORY_CATALOG (the Record type
 * enforces it), so a new category has to be placed in a group.
 */
export type Difficulty = 1 | 2 | 3;

/**
 * `dots` is the plain-text form (e.g. inside a <select>); elsewhere the
 * DifficultyMark component draws the same thing as three small pips.
 */
export const DIFFICULTY_INFO: Record<Difficulty, { dots: string; label: string }> = {
  1: { dots: "●○○", label: "Łatwa" },
  2: { dots: "●●○", label: "Średnia" },
  3: { dots: "●●●", label: "Trudna" },
};

/** Groups in display order. */
export const CATEGORY_GROUPS = [
  { id: "home", emoji: "🏠", label: "Dom i codzienność" },
  { id: "food", emoji: "🍔", label: "Jedzenie" },
  { id: "nature", emoji: "🐾", label: "Zwierzęta i przyroda" },
  { id: "places", emoji: "🌍", label: "Geografia i miejsca" },
  { id: "people", emoji: "⭐", label: "Znani ludzie" },
  { id: "screen", emoji: "🎬", label: "Filmy, książki i bajki" },
  { id: "games", emoji: "🎮", label: "Gry wideo i aplikacje" },
  { id: "leisure", emoji: "⚽", label: "Sport i rozrywka" },
  { id: "brands", emoji: "🛍️", label: "Marki i reklama" },
  { id: "holidays", emoji: "🎄", label: "Święta i okazje" },
  { id: "brain", emoji: "🧠", label: "Wiedza i łamigłówki" },
] as const;

export type CategoryGroupId = (typeof CATEGORY_GROUPS)[number]["id"];

export const CATEGORY_CATALOG: Record<Category, { group: CategoryGroupId; difficulty: Difficulty }> = {
  // Dom i codzienność
  "Gadżety kuchenne": { group: "home", difficulty: 1 },
  "Pranie": { group: "home", difficulty: 1 },
  "Lodówka": { group: "home", difficulty: 1 },
  "Ubrania, buty i dodatki": { group: "home", difficulty: 1 },
  "Szuflada z rupieciami": { group: "home", difficulty: 2 },
  "Garaż": { group: "home", difficulty: 2 },
  "Kosmetyki i akcesoria": { group: "home", difficulty: 2 },
  "Fryzury": { group: "home", difficulty: 2 },
  // Jedzenie
  "Owoce": { group: "food", difficulty: 1 },
  "Polskie potrawy": { group: "food", difficulty: 1 },
  "Jedzenie z jarmarku": { group: "food", difficulty: 1 },
  "Kraj po potrawie": { group: "food", difficulty: 2 },
  // Zwierzęta i przyroda
  "Psy": { group: "nature", difficulty: 2 },
  "Straszne zwierzęta": { group: "nature", difficulty: 2 },
  "Zwierzęce maluchy": { group: "nature", difficulty: 2 },
  "Kwiaty": { group: "nature", difficulty: 2 },
  "Przyroda Polski": { group: "nature", difficulty: 2 },
  "Rasy kotów": { group: "nature", difficulty: 3 },
  "Rośliny doniczkowe": { group: "nature", difficulty: 3 },
  // Geografia i miejsca
  "Stolice Europy": { group: "places", difficulty: 2 },
  "Flagi Europy": { group: "places", difficulty: 2 },
  "Znane budynki i pomniki": { group: "places", difficulty: 2 },
  "Stolice spoza Europy": { group: "places", difficulty: 3 },
  "Panoramy miast": { group: "places", difficulty: 3 },
  // Znani ludzie
  "Diwy popu": { group: "people", difficulty: 2 },
  "Polskie piosenkarki": { group: "people", difficulty: 2 },
  "Polscy piosenkarze": { group: "people", difficulty: 2 },
  "Polscy sportowcy": { group: "people", difficulty: 2 },
  "Polskie aktorki": { group: "people", difficulty: 3 },
  "Polscy aktorzy": { group: "people", difficulty: 3 },
  "Polscy raperzy": { group: "people", difficulty: 3 },
  "Polscy influencerzy i celebryci": { group: "people", difficulty: 3 },
  // Filmy, książki i bajki
  "Postacie Disneya": { group: "screen", difficulty: 1 },
  "Superbohaterowie i złoczyńcy": { group: "screen", difficulty: 1 },
  "Polskie seriale i programy TV": { group: "screen", difficulty: 2 },
  "Czarne charaktery z filmów": { group: "screen", difficulty: 2 },
  "Postacie z Harry'ego Pottera": { group: "screen", difficulty: 2 },
  "Filmy": { group: "screen", difficulty: 2 },
  "Bajki i filmy 2000-2010": { group: "screen", difficulty: 2 },
  "Rozrywka w Polsce": { group: "screen", difficulty: 2 },
  "Emoji-rebusy": { group: "screen", difficulty: 2 },
  "Książki": { group: "screen", difficulty: 3 },
  "Anime": { group: "screen", difficulty: 3 },
  // Gry wideo i aplikacje
  "Aplikacje": { group: "games", difficulty: 1 },
  "Pokémony": { group: "games", difficulty: 2 },
  "Postacie z gier wideo": { group: "games", difficulty: 2 },
  "Gry wideo": { group: "games", difficulty: 2 },
  "Minecraft": { group: "games", difficulty: 2 },
  "Gry i aplikacje z emoji": { group: "games", difficulty: 2 },
  "Gothic": { group: "games", difficulty: 3 },
  "Znani polscy politycy": { group: "people", difficulty: 2 },
  "Siłownia": { group: "leisure", difficulty: 1 },
  "Polskie miasta": { group: "places", difficulty: 2 },
  "Waluty": { group: "brain", difficulty: 2 },
  "Supersamochody": { group: "brands", difficulty: 3 },
  "Marki samochodowe": { group: "brands", difficulty: 2 },
  "Ciasta i desery": { group: "food", difficulty: 1 },
  "Kawy i napoje": { group: "food", difficulty: 1 },
  "Paznokcie i makijaż": { group: "home", difficulty: 2 },
  "Kamienie szlachetne": { group: "nature", difficulty: 3 },
  // Sport i rozrywka
  "Sporty": { group: "leisure", difficulty: 1 },
  "Gry planszowe": { group: "leisure", difficulty: 2 },
  "Wesołe miasteczka": { group: "leisure", difficulty: 3 },
  // Marki i reklama
  "Marki kosmetyków": { group: "brands", difficulty: 2 },
  "Marki modowe": { group: "brands", difficulty: 2 },
  "Slogany reklamowe": { group: "brands", difficulty: 3 },
  // Święta i okazje
  "Halloween": { group: "holidays", difficulty: 1 },
  "Boże Narodzenie": { group: "holidays", difficulty: 1 },
  "Potwory i demony": { group: "holidays", difficulty: 2 },
  "Kostiumy na Halloween": { group: "holidays", difficulty: 2 },
  "Święta i daty": { group: "holidays", difficulty: 2 },
  // Wiedza i łamigłówki
  "Tabliczka mnożenia": { group: "brain", difficulty: 1 },
  "Dokończ przysłowie": { group: "brain", difficulty: 1 },
  "Zawody z emoji": { group: "brain", difficulty: 1 },
  "Matematyka": { group: "brain", difficulty: 2 },
  "Liczby rzymskie": { group: "brain", difficulty: 2 },
  "Ile tego jest?": { group: "brain", difficulty: 2 },
  "Skróty": { group: "brain", difficulty: 2 },
  "Jaki to kolor?": { group: "brain", difficulty: 2 },
  "Przysłowia z emoji": { group: "brain", difficulty: 3 },
};

export type CategorySort = "alpha" | "easy-first" | "hard-first";

export const CATEGORY_SORT_LABELS: Record<CategorySort, string> = {
  alpha: "Alfabetycznie",
  "easy-first": "Od najłatwiejszych",
  "hard-first": "Od najtrudniejszych",
};

export type CategoryViewOptions = {
  grouped: boolean;
  showDifficulty: boolean;
  sort: CategorySort;
};

export const DEFAULT_VIEW_OPTIONS: CategoryViewOptions = {
  grouped: true,
  showDifficulty: true,
  sort: "alpha",
};

/** Catalog entry for a category key; unknown keys (e.g. the mix) get none. */
export const catalogEntry = (id: string) =>
  id in CATEGORY_CATALOG ? CATEGORY_CATALOG[id as Category] : undefined;

export type CategorySection<T> = {
  /** Undefined when grouping is off: one section with everything. */
  group?: (typeof CATEGORY_GROUPS)[number];
  items: T[];
};

/**
 * Sorts (and optionally groups) anything with a category `id` and `name`.
 * Ties in difficulty fall back to alphabetical order; empty groups are
 * dropped.
 */
export const arrangeCategories = <T extends { id: string; name: string }>(
  items: T[],
  { grouped, sort }: Pick<CategoryViewOptions, "grouped" | "sort">
): CategorySection<T>[] => {
  const difficulty = (item: T) => catalogEntry(item.id)?.difficulty ?? 2;
  const sorted = [...items].sort((a, b) => {
    if (sort !== "alpha") {
      const diff = difficulty(a) - difficulty(b);
      if (diff !== 0) return sort === "easy-first" ? diff : -diff;
    }
    return a.name.localeCompare(b.name, "pl");
  });

  if (!grouped) return [{ items: sorted }];

  return CATEGORY_GROUPS.map((group) => ({
    group,
    items: sorted.filter((item) => catalogEntry(item.id)?.group === group.id),
  })).filter((section) => section.items.length > 0);
};
