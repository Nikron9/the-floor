import { describe, expect, it } from "vitest";
import { CATEGORY_METADATA, type Category } from "../app/data";
import {
  CATEGORY_CATALOG,
  CATEGORY_GROUPS,
  HALLOWEEN_CATEGORIES,
  arrangeCategories,
} from "../app/categories/catalog";

const items = (Object.keys(CATEGORY_METADATA) as Category[]).map((id) => ({
  id,
  name: CATEGORY_METADATA[id].name,
}));

describe("category catalog", () => {
  it("places every category in a known group with a difficulty", () => {
    const groups = new Set<string>(CATEGORY_GROUPS.map(({ id }) => id));
    for (const id of Object.keys(CATEGORY_METADATA) as Category[]) {
      expect(groups.has(CATEGORY_CATALOG[id].group), id).toBe(true);
      expect([1, 2, 3]).toContain(CATEGORY_CATALOG[id].difficulty);
    }
  });

  it("leaves no group empty", () => {
    for (const { id } of CATEGORY_GROUPS) {
      if (id === "halloween") continue; // seasonal, filled from HALLOWEEN_CATEGORIES
      expect(Object.values(CATEGORY_CATALOG).some((e) => e.group === id), id).toBe(true);
    }
  });

  it("shows the Halloween group first, and only in the Halloween theme", () => {
    const classic = arrangeCategories(items, { grouped: true, sort: "alpha" });
    expect(classic.some(({ group }) => group?.id === "halloween")).toBe(false);
    expect(classic.flatMap((s) => s.items)).toHaveLength(items.length);

    const halloween = arrangeCategories(items, { grouped: true, sort: "alpha" }, true);
    expect(halloween[0].group?.id).toBe("halloween");
    expect(halloween[0].items.map(({ id }) => id).sort()).toEqual([...HALLOWEEN_CATEGORIES].sort());
    expect(halloween.flatMap((s) => s.items)).toHaveLength(items.length);
  });

  it("sorts alphabetically in one section when grouping is off", () => {
    const [section, ...rest] = arrangeCategories(items, { grouped: false, sort: "alpha" });
    expect(rest).toHaveLength(0);
    const names = section.items.map(({ name }) => name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "pl")));
  });

  it("sorts by difficulty both ways and keeps every category once", () => {
    for (const sort of ["easy-first", "hard-first"] as const) {
      const sections = arrangeCategories(items, { grouped: true, sort });
      expect(sections.flatMap((s) => s.items)).toHaveLength(items.length);
      for (const { items: sectionItems } of sections) {
        const levels = sectionItems.map(({ id }) => CATEGORY_CATALOG[id].difficulty);
        const expected = [...levels].sort((a, b) => (sort === "easy-first" ? a - b : b - a));
        expect(levels).toEqual(expected);
      }
    }
  });
});
