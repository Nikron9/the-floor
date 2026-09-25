import { describe, expect, it } from "vitest";

import {
  categoryDisplayName,
  isCuratedCategoryId,
  isImageExample,
  isTextExample,
  listSelectableCategories,
  resolveCategory,
} from "../app/categories/registry";
import { CATEGORY_METADATA } from "../app/data";

describe("resolving curated categories", () => {
  it("turns folder + filename into a src the browser can load", () => {
    const resolved = resolveCategory("Owoce");

    expect(resolved?.name).toBe("Owoce");
    expect(resolved?.examples[0]).toEqual({
      name: "Jabłko",
      alternatives: [],
      src: "/images/fruits/apple.png",
    });
  });

  it("keeps text prompts as text, with no src", () => {
    const resolved = resolveCategory("Matematyka");
    const example = resolved?.examples[0];

    expect(example && isTextExample(example)).toBe(true);
    expect(example && isImageExample(example)).toBe(false);
    expect(example).not.toHaveProperty("src");
  });

  it("resolves every curated category without throwing", () => {
    for (const id of Object.keys(CATEGORY_METADATA)) {
      const resolved = resolveCategory(id);
      expect(resolved, `${id} did not resolve`).toBeDefined();
      expect(resolved!.examples.length).toBeGreaterThan(0);
    }
  });

  it("hands out a fresh array each time", () => {
    // round.tsx shuffles the examples in debug mode. When resolution returned
    // the array off CATEGORY_METADATA, that sort reordered the category for
    // the rest of the session.
    const first = resolveCategory("Owoce")!;
    const second = resolveCategory("Owoce")!;

    expect(first.examples).not.toBe(second.examples);
    expect(first.examples).toEqual(second.examples);

    first.examples.reverse();
    expect(resolveCategory("Owoce")!.examples[0].name).toBe("Jabłko");
  });
});

describe("category ids", () => {
  it("still resolves the old English keys from saved games", () => {
    expect(resolveCategory("Fruits")?.id).toBe("Owoce");
    expect(categoryDisplayName("Pop divas")).toBe("Diwy popu");
    expect(resolveCategory("Anime")?.id).toBe("Anime");
  });

  it("recognises curated keys and nothing else", () => {
    expect(isCuratedCategoryId("Owoce")).toBe(true);
    expect(isCuratedCategoryId("community:abc-123")).toBe(false);
    expect(resolveCategory("community:abc-123")).toBeUndefined();
    expect(resolveCategory(undefined)).toBeUndefined();
  });

  it("does not mistake inherited object keys for curated categories", () => {
    // A stored key like "constructor" or "toString" would otherwise resolve
    // against Object.prototype and blow up on meta.examples.
    for (const key of ["constructor", "toString", "__proto__", "valueOf"]) {
      expect(isCuratedCategoryId(key), `${key} matched`).toBe(false);
      expect(resolveCategory(key), `${key} resolved`).toBeUndefined();
    }
  });
});

describe("listing categories for the host", () => {
  const listed = listSelectableCategories();

  it("lists every curated category, sorted by display name", () => {
    expect(listed).toHaveLength(Object.keys(CATEGORY_METADATA).length);
    const names = listed.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe("display names", () => {
  it("uses the category's display name for curated ones", () => {
    expect(categoryDisplayName("Owoce")).toBe("Owoce");
  });

  it("falls back to the raw id rather than rendering blank", () => {
    expect(categoryDisplayName("community:gone")).toBe("community:gone");
    expect(categoryDisplayName(undefined)).toBe("");
  });
});
