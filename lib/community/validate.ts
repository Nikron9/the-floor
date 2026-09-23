import { LIMITS } from "./config";
import { newId } from "./ids";
import type { CommunityItem } from "./types";

export class InvalidInput extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInput";
  }
}

/** Collapses whitespace and strips control characters. */
export const cleanText = (value: unknown): string =>
  typeof value === "string"
    // eslint-disable-next-line no-control-regex
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim()
    : "";

export const parseCategoryName = (value: unknown): string => {
  const name = cleanText(value);
  if (name.length < 2) {
    throw new InvalidInput("Nadaj kategorii nazwę.");
  }
  if (name.length > LIMITS.maxCategoryNameLength) {
    throw new InvalidInput(
      `Nazwa kategorii może mieć maksymalnie ${LIMITS.maxCategoryNameLength} znaków.`
    );
  }
  return name;
};

const parseAlternatives = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const alternatives: string[] = [];

  for (const entry of value) {
    const text = cleanText(entry);
    if (!text || text.length > LIMITS.maxItemNameLength) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    alternatives.push(text);
    if (alternatives.length >= LIMITS.maxAlternativesPerItem) break;
  }

  return alternatives;
};

/**
 * Turns whatever the create page posted into items we're willing to store.
 *
 * Duplicates are dropped rather than rejected -- the AI suggester occasionally
 * repeats itself, and making someone hunt for the collision is a worse
 * experience than quietly keeping the first one.
 *
 * Editing a saved category passes `rejectDuplicates`: there, a rename that
 * collides with another item would otherwise make the renamed item vanish,
 * picture and all, with no hint why.
 */
export const parseItems = (
  value: unknown,
  {
    existing = [],
    rejectDuplicates = false,
  }: { existing?: CommunityItem[]; rejectDuplicates?: boolean } = {}
): CommunityItem[] => {
  if (!Array.isArray(value)) {
    throw new InvalidInput("Oczekiwano listy elementów.");
  }

  const byId = new Map(existing.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const usedIds = new Set<string>();
  const items: CommunityItem[] = [];

  for (const entry of value) {
    const raw = entry as Record<string, unknown> | null;
    const name = cleanText(raw?.name);
    if (!name) continue;
    if (name.length > LIMITS.maxItemNameLength) {
      throw new InvalidInput(
        `"${name.slice(0, 20)}..." is longer than ${LIMITS.maxItemNameLength} characters.`
      );
    }

    const key = name.toLowerCase();
    if (seen.has(key)) {
      if (rejectDuplicates) {
        throw new InvalidInput(`Element „${name}” już jest w tej kategorii.`);
      }
      continue;
    }
    seen.add(key);

    // Image fields are never taken from the request. They're only ever set by
    // the upload route, which is what stops someone pointing a published
    // category at an arbitrary URL. An id claimed twice only keeps its
    // picture the first time, so two items can't end up sharing one.
    const previous =
      typeof raw?.id === "string" && !usedIds.has(raw.id)
        ? byId.get(raw.id)
        : undefined;
    if (previous) usedIds.add(previous.id);

    items.push({
      id: previous?.id ?? newId(),
      name,
      alternatives: parseAlternatives(raw?.alternatives),
      imageKey: previous?.imageKey ?? null,
      imageUrl: previous?.imageUrl ?? null,
      width: previous?.width ?? null,
      height: previous?.height ?? null,
      credit: previous?.credit ?? null,
    });

    if (items.length >= LIMITS.maxItemsPerCategory) break;
  }

  if (items.length === 0) {
    throw new InvalidInput("Dodaj co najmniej jeden element.");
  }

  return items;
};

export const assertPublishable = (items: CommunityItem[]): void => {
  const withImages = items.filter((item) => item.imageUrl);

  if (withImages.length < LIMITS.minItemsToPublish) {
    throw new InvalidInput(
      `Do publikacji kategoria potrzebuje co najmniej ${LIMITS.minItemsToPublish} ` +
        `elementów z obrazkami. Ta ma ${withImages.length}.`
    );
  }
};
