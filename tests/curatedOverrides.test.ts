import { describe, expect, it } from "vitest";

import { primaryAnswer } from "../app/categories/answers";
import { resolveCategory } from "../app/categories/registry";
import { CATEGORY_METADATA, type Category } from "../app/data";
import { curatedImageKey, findCuratedImage } from "../lib/curated/catalog";

const imageCategory = (Object.keys(CATEGORY_METADATA) as Category[]).find((key) =>
  CATEGORY_METADATA[key].examples.some((example) => "image" in example)
)!;
const meta = CATEGORY_METADATA[imageCategory];
const firstExample = meta.examples.find((example) => "image" in example) as import("../app/categories/data/types").ImageExample;
const firstImage = {
  image: firstExample.image,
  name: primaryAnswer(firstExample),
};

describe("curated picture overrides", () => {
  it("replaces only the overridden example's picture", () => {
    const overrides = { [meta.folder]: { [firstImage.image]: "https://example.org/new.jpg" } };
    const plain = resolveCategory(imageCategory)!;
    const replaced = resolveCategory(imageCategory, {}, overrides)!;

    expect(replaced.examples.map((e) => e.name)).toEqual(plain.examples.map((e) => e.name));
    replaced.examples.forEach((example, index) => {
      const src = "src" in example ? example.src : undefined;
      const original = plain.examples[index];
      const originalSrc = "src" in original ? original.src : undefined;
      if (example.name === firstImage.name) {
        expect(src).toBe("https://example.org/new.jpg");
      } else {
        expect(src).toBe(originalSrc);
      }
    });
  });

  it("falls back to the shipped file without overrides", () => {
    const resolved = resolveCategory(imageCategory, {}, {})!;
    const example = resolved.examples.find((e) => e.name === firstImage.name)!;
    expect("src" in example && example.src).toBe(`/images/${meta.folder}/${firstImage.image}`);
  });

  it("only accepts images a curated category actually references", () => {
    expect(findCuratedImage(meta.folder, firstImage.image)?.name).toBe(firstImage.name);
    expect(findCuratedImage(meta.folder, "not-there.jpg")).toBeUndefined();
    expect(findCuratedImage("no-such-folder", firstImage.image)).toBeUndefined();
  });

  it("builds storage keys the image route will serve", () => {
    const key = curatedImageKey("polish-dishes", "kotlet-schabowy.jpg", "ab12cd");
    expect(key).toMatch(/^categories\/[A-Za-z0-9]+\/[A-Za-z0-9]+-[a-f0-9]+\.webp$/);
  });
});
