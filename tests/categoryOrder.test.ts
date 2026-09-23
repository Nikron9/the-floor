import { describe, expect, it } from "vitest";

import { CATEGORY_METADATA } from "../app/data";

/**
 * Rounds show examples in the order they are written, so an alphabetical
 * category lets players guess what comes next ("after Kubica, someone on L").
 * Order can be deliberate (easiest first) or arbitrary -- just not sorted.
 *
 * Checked on the full name and on the last word, because people are usually
 * listed by surname. A random order sits near 0.5 ascending pairs; 0.85 only
 * trips on a list that is sorted with a few exceptions.
 */
const MAX_ASCENDING_SHARE = 0.85;

const ascendingShare = (keys: string[]): number => {
  let ascending = 0;
  for (let i = 1; i < keys.length; i += 1) {
    if (keys[i - 1].localeCompare(keys[i], "pl") <= 0) ascending += 1;
  }
  return ascending / (keys.length - 1);
};

describe("categories are not in alphabetical order", () => {
  for (const [id, category] of Object.entries(CATEGORY_METADATA)) {
    const names = category.examples.map((example) => example.name);
    if (names.length < 5) continue;

    it(`${id} is not sorted by name`, () => {
      expect(ascendingShare(names)).toBeLessThan(MAX_ASCENDING_SHARE);
    });

    it(`${id} is not sorted by last word`, () => {
      const lastWords = names.map((name) => name.trim().split(/\s+/).pop() ?? name);
      expect(ascendingShare(lastWords)).toBeLessThan(MAX_ASCENDING_SHARE);
    });
  }
});
