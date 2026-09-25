import {
  CATEGORY_METADATA,
  type Category,
  type CategoryId,
  type ImageExample,
  type TextExample,
} from "../data";
import { answerList } from "./answers";

/**
 * Turning a category key into something the screen can render.
 *
 * Curated categories live in `app/categories/data/` (registered in
 * `app/data.ts`) and point at files under
 * `public/images/<folder>/`. Community categories are created in the browser
 * and point at absolute URLs on the image host. The game shouldn't have to care
 * which it got, so both collapse into a `ResolvedCategory` whose image examples
 * carry a ready-to-use `src`.
 */

export type CategorySource = "curated" | "community";

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
  source: CategorySource;
  examples: ResolvedExample[];
};

/**
 * A community category as it travels through the app: already flattened, with
 * absolute image URLs, so it can be dropped into a game and replayed later
 * without another round trip to the API.
 */
/**
 * Picture replacements for curated categories, made in the app and kept in
 * the database so deploys don't overwrite them: `{ [folder]: { [image]: src } }`.
 * See lib/curated/overrides.ts and useCuratedOverrides.
 */
export type CuratedOverrides = Readonly<
  Record<string, Readonly<Record<string, string>>>
>;

export type CommunityCategory = {
  id: string;
  name: string;
  examples: ResolvedImageExample[];
};

/** Namespaces community keys so they can never collide with a curated name. */
export const COMMUNITY_ID_PREFIX = "community:";

export const communityCategoryId = (id: string): string =>
  id.startsWith(COMMUNITY_ID_PREFIX) ? id : `${COMMUNITY_ID_PREFIX}${id}`;

export const isCommunityCategoryId = (id: CategoryId): boolean =>
  typeof id === "string" && id.startsWith(COMMUNITY_ID_PREFIX);

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
  "Famous people who died before turning 30": "Sławni, którzy zmarli przed 30",
  "Fast food chains": "Sieci fast food",
  Fridge: "Lodówka",
  Fruits: "Owoce",
  Garage: "Garaż",
  "Harry Potter characters": "Postacie z Harry'ego Pottera",
  Holidays: "Święta",
  Horses: "Konie",
  "Junk drawer": "Szuflada z rupieciami",
  "Kitchen gadgets": "Gadżety kuchenne",
  Laundry: "Pranie",
  Math: "Matematyka",
  Movies: "Filmy",
  Pokemon: "Pokémony",
  "Pool Equipment": "Wyposażenie basenu",
  "Pop divas": "Diwy popu",
  "Rom Coms": "Komedie romantyczne",
  "Spirit Halloween Catalogue": "Kostiumy na Halloween",
  Sports: "Sporty",
  Superheros: "Superbohaterowie",
  "Taylor Swift Lyrics": "Teksty Taylor Swift",
  Thanksgiving: "Święto Dziękczynienia",
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

const resolveCuratedExample = (
  folder: string,
  example: ImageExample | TextExample,
  overrides: CuratedOverrides
): ResolvedExample => {
  if ("text" in example) {
    const [name = "", ...alternatives] = answerList(example);
    return { name, alternatives, text: example.text };
  }

  const [name = "", ...alternatives] = answerList(example);
  return {
    name,
    alternatives,
    src:
      overrides[folder]?.[example.image] ?? `/images/${folder}/${example.image}`,
  };
};

export const resolveCuratedCategory = (
  id: Category,
  overrides: CuratedOverrides = {}
): ResolvedCategory => {
  const meta = CATEGORY_METADATA[id];

  return {
    id,
    name: meta.name,
    source: "curated",
    examples: (meta.examples as Array<ImageExample | TextExample>).map(
      (example) => resolveCuratedExample(meta.folder, example, overrides)
    ),
  };
};

export const resolveCommunityCategory = (
  category: CommunityCategory
): ResolvedCategory => ({
  id: communityCategoryId(category.id),
  name: category.name,
  source: "community",
  examples: category.examples,
});

/**
 * The single lookup the game uses. `community` is whatever the host has pulled
 * into this game -- see `useCommunityCategories`.
 *
 * Returns undefined for a key we no longer know about, which happens when a
 * saved game references a community category the host has since removed. Every
 * caller has to handle that; the game used to crash on `CATEGORY_METADATA[id]`
 * returning undefined.
 */
export const resolveCategory = (
  id: CategoryId | undefined,
  community: Readonly<Record<string, CommunityCategory>> = {},
  curatedOverrides: CuratedOverrides = {}
): ResolvedCategory | undefined => {
  if (!id) return undefined;

  const curated = canonicalCategoryId(id);
  if (isCuratedCategoryId(curated)) {
    return resolveCuratedCategory(curated, curatedOverrides);
  }

  const found =
    own(community, communityCategoryId(id)) ?? own(community, id);
  return found ? resolveCommunityCategory(found) : undefined;
};

/**
 * Every category a host can currently assign to a player, curated first and
 * each group alphabetical -- the order the presenter's dropdown shows.
 */
export const listSelectableCategories = (
  community: Readonly<Record<string, CommunityCategory>> = {}
): Array<{ id: CategoryId; name: string; source: CategorySource }> => {
  const curated = (Object.keys(CATEGORY_METADATA) as Category[])
    .map((id) => ({
      id: id as CategoryId,
      name: CATEGORY_METADATA[id].name,
      source: "curated" as const,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const contributed = Object.values(community)
    .map((category) => ({
      id: communityCategoryId(category.id),
      name: category.name,
      source: "community" as const,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...curated, ...contributed];
};

/**
 * What to print for a category key. Community ids are opaque, so fall back to
 * the stored name and only ever show the raw key when we've lost the category
 * entirely.
 */
export const categoryDisplayName = (
  id: CategoryId | undefined,
  community: Readonly<Record<string, CommunityCategory>> = {}
): string => {
  if (!id) return "";
  return resolveCategory(id, community)?.name ?? String(id);
};
