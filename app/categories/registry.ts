import {
  CATEGORY_METADATA,
  type Category,
  type CategoryId,
} from "../data";
import { curatedItems, type CuratedItem } from "./examples";

/**
 * Turning a category key into something the screen can render.
 *
 * Curated categories live in `app/categories/data/` (registered in
 * `app/data.ts`) and point at files under
 * `public/images/<folder>/` (or at a replacement made in the image editor).
 * They collapse into a `ResolvedCategory` whose image examples carry a
 * ready-to-use `src`.
 */

export type ResolvedImageExample = {
  name: string;
  alternatives: string[];
  src: string;
};

export type ResolvedTextExample = {
  name: string;
  alternatives: string[];
  text: string;
};

export type ResolvedExample = ResolvedImageExample | ResolvedTextExample;

export type ResolvedCategory = {
  id: CategoryId;
  /** What the host and the projector show. */
  name: string;
  examples: ResolvedExample[];
  /** Pre-round prompt; see CategoryMetadata.instruction. */
  instruction?: string;
  /** Extra rules; see CategoryMetadata.details. */
  details?: string[];
};

/**
 * Picture replacements for curated categories, made in the app and kept in
 * the database so deploys don't overwrite them: `{ [folder]: { [image]: src } }`.
 * See lib/curated/overrides.ts and useCuratedOverrides.
 */
export type CuratedOverrides = Readonly<
  Record<string, Readonly<Record<string, string>>>
>;

/**
 * Own-property lookup only.
 *
 * These maps are keyed by names that ultimately come from user input, so a
 * plain `map[id]` happily returns `Object.prototype` for "__proto__" and a
 * function for "constructor" -- both truthy, neither a category.
 */
const own = <T>(
  map: Readonly<Record<string, T>>,
  key: string
): T | undefined =>
  Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;

/**
 * Curated categories used to be keyed by their English names. Games saved in
 * a browser before the switch to Polish keys still carry those, so map them to
 * the current key instead of treating them as unknown.
 */
const LEGACY_CATEGORY_IDS: Readonly<Record<string, Category>> = {
  "Amusement Parks": "Wesołe miasteczka",
  Apps: "Aplikacje",
  "Board games": "Gry planszowe",
  Books: "Książki",
  "Brand slogans": "Slogany reklamowe",
  "City Skylines": "Panoramy miast",
  "Disney Channel Original Movies": "Bajki i filmy 2000-2010",
  "Filmy Disney Channel": "Bajki i filmy 2000-2010",
  "Disney characters": "Postacie Disneya",
  Dogs: "Psy",
  "EU Flags": "Flagi Europy",
  "Fair foods": "Jedzenie z jarmarku",
  "Czarne charaktery z horrorów": "Czarne charaktery z filmów",
  "Dekoracje na Halloween": "Halloween",
  Fridge: "Lodówka",
  Fruits: "Owoce",
  Garage: "Garaż",
  "Harry Potter characters": "Postacie z Harry'ego Pottera",
  Holidays: "Boże Narodzenie",
  "Święta": "Boże Narodzenie",
  "Junk drawer": "Szuflada z rupieciami",
  "Kitchen gadgets": "Gadżety kuchenne",
  Laundry: "Pranie",
  Math: "Matematyka",
  Movies: "Filmy",
  Pokemon: "Pokémony",
  "Pop divas": "Diwy popu",
  "Spirit Halloween Catalogue": "Kostiumy na Halloween",
  Sports: "Sporty",
  Superheros: "Superbohaterowie i złoczyńcy",
  Superbohaterowie: "Superbohaterowie i złoczyńcy",
  "Time Tables": "Tabliczka mnożenia",
  "Video Game Characters": "Postacie z gier wideo",
  "Video Games": "Gry wideo",
};

/** The current key for `id`, translating an old English curated key. */
export const canonicalCategoryId = (id: CategoryId): CategoryId =>
  own(LEGACY_CATEGORY_IDS, id) ?? id;

export const isCuratedCategoryId = (id: CategoryId): id is Category =>
  Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, id);

export const isImageExample = (
  example: ResolvedExample
): example is ResolvedImageExample => "src" in example;

export const isTextExample = (
  example: ResolvedExample
): example is ResolvedTextExample => "text" in example;

/** A curated item (edits applied) in the shape the round renders. */
const toResolved = (item: CuratedItem): ResolvedExample | undefined => {
  if (item.text !== undefined) {
    return { name: item.name, alternatives: item.alternatives, text: item.text };
  }
  // An added picture example has nothing to show until a picture is set.
  if (!item.src) return undefined;
  return { name: item.name, alternatives: item.alternatives, src: item.src };
};

const resolvedItems = (id: Category, overrides: CuratedOverrides): ResolvedExample[] =>
  curatedItems(id, overrides).flatMap((item) => {
    const resolved = toResolved(item);
    return resolved ? [resolved] : [];
  });

export const resolveCuratedCategory = (
  id: Category,
  overrides: CuratedOverrides = {}
): ResolvedCategory => {
  const meta = CATEGORY_METADATA[id];

  return {
    id,
    name: meta.name,
    instruction: meta.instruction,
    details: meta.details,
    examples: resolvedItems(id, overrides),
  };
};

/**
 * Pseudo-category behind the "Miks kategorii" single round: every curated
 * picture from every image category, mixed together. It never appears in the
 * game's category list; the presenter opens it directly as a one-off round.
 */
export const MIXED_CATEGORY_ID = "__co-to-jest__";

/** Picture categories that make no sense out of context. */
const MIXED_EXCLUDED_FOLDERS = new Set(["colors"]);

export const resolveMixedCategory = (
  overrides: CuratedOverrides = {}
): ResolvedCategory => ({
  id: MIXED_CATEGORY_ID,
  name: "Miks kategorii",
  instruction:
    "Na ekranie pojawi się obrazek z dowolnej kategorii. Powiedz, co przedstawia.",
  details: [
    "Obrazki pochodzą ze wszystkich kategorii obrazkowych, w losowej kolejności.",
    "Zaliczana jest każda odpowiedź, którą uznałaby dana kategoria.",
  ],
  examples: (Object.keys(CATEGORY_METADATA) as Category[]).flatMap((id) => {
    const meta = CATEGORY_METADATA[id];
    if (MIXED_EXCLUDED_FOLDERS.has(meta.folder)) return [];
    return resolvedItems(id, overrides).filter(isImageExample);
  }),
});

/**
 * The single lookup the game uses.
 *
 * Returns undefined for a key we no longer know about, which happens when a
 * saved game references a category that has since been removed. Every
 * caller has to handle that; the game used to crash on `CATEGORY_METADATA[id]`
 * returning undefined.
 */
export const resolveCategory = (
  id: CategoryId | undefined,
  curatedOverrides: CuratedOverrides = {}
): ResolvedCategory | undefined => {
  if (!id) return undefined;
  if (id === MIXED_CATEGORY_ID) return resolveMixedCategory(curatedOverrides);

  const curated = canonicalCategoryId(id);
  if (isCuratedCategoryId(curated)) {
    return resolveCuratedCategory(curated, curatedOverrides);
  }

  return undefined;
};

/**
 * Every category a host can assign to a player, alphabetical -- the order the
 * presenter's dropdown shows.
 */
export const listSelectableCategories = (): Array<{ id: CategoryId; name: string }> =>
  (Object.keys(CATEGORY_METADATA) as Category[])
    .map((id) => ({ id: id as CategoryId, name: CATEGORY_METADATA[id].name }))
    .sort((a, b) => a.name.localeCompare(b.name));

/** What to print for a category key; the raw key only if the category is gone. */
export const categoryDisplayName = (id: CategoryId | undefined): string => {
  if (!id) return "";
  return resolveCategory(id)?.name ?? String(id);
};
