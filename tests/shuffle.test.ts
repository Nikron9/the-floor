import { describe, expect, it } from "vitest";
import { seededShuffle } from "../app/categories/shuffle";
import { roundInstruction } from "../app/categories/instructions";
import {
  MIXED_CATEGORY_ID,
  isImageExample,
  resolveCategory,
} from "../app/categories/registry";

describe("seededShuffle", () => {
  const items = Array.from({ length: 50 }, (_, i) => i);

  it("keeps every item exactly once and leaves the input alone", () => {
    const copy = [...items];
    const shuffled = seededShuffle(items, 123);
    expect(items).toEqual(copy);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(items);
  });

  it("gives the same order for the same seed", () => {
    expect(seededShuffle(items, 42)).toEqual(seededShuffle(items, 42));
  });

  it("actually reorders", () => {
    expect(seededShuffle(items, 7)).not.toEqual(items);
    expect(seededShuffle(items, 7)).not.toEqual(seededShuffle(items, 8));
  });
});

describe("roundInstruction", () => {
  it("falls back to a prompt that matches the example kind", () => {
    expect(
      roundInstruction({ examples: [{ name: "a", alternatives: [], src: "/x.jpg" }] })
        .kind
    ).toBe("image");
    expect(
      roundInstruction({ examples: [{ name: "a", alternatives: [], text: "1 + 1" }] })
        .kind
    ).toBe("text");
  });

  it("prefers the category's own instruction", () => {
    expect(
      roundInstruction({
        examples: [{ name: "a", alternatives: [], text: "X" }],
        instruction: "Podaj wartość.",
      }).prompt
    ).toBe("Podaj wartość.");
  });

  it("passes category details through and defaults to none", () => {
    const example = { name: "a", alternatives: [], text: "X" };
    expect(roundInstruction({ examples: [example] }).details).toEqual([]);
    expect(
      roundInstruction({ examples: [example], details: ["(±2)"] }).details
    ).toEqual(["(±2)"]);
  });

  it("explains the tolerance in \"Ile tego jest?\"", () => {
    const details = resolveCategory("Ile tego jest?")?.details ?? [];
    expect(details.some((line) => line.includes("±"))).toBe(true);
  });
});

describe("mixed \"Miks kategorii\" round", () => {
  const mixed = resolveCategory(MIXED_CATEGORY_ID);

  it("pools pictures from many categories", () => {
    expect(mixed?.name).toBe("Miks kategorii");
    expect(mixed?.examples.length).toBeGreaterThan(1000);
    expect(mixed?.examples.every(isImageExample)).toBe(true);
  });

  it("leaves out plain colour squares", () => {
    expect(mixed?.examples.some((e) => "src" in e && e.src.includes("/colors/"))).toBe(false);
  });
});
