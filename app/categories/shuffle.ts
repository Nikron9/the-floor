/**
 * Deterministic shuffle used for single rounds started from the presenter
 * menu. A full game keeps each category's fixed order (easiest first); a
 * one-off round draws the examples in random order instead.
 *
 * Seeded rather than `Math.random()` inside the sort so the order stays put
 * when the category re-resolves mid-round (for example when curated image
 * overrides finish loading): the same seed and length give the same order.
 */

/** mulberry32 -- small, fast, good enough for ordering game prompts. */
const random = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Fisher-Yates over a copy; the input is never modified. */
export const seededShuffle = <T>(items: readonly T[], seed: number): T[] => {
  const next = random(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const newShuffleSeed = () => Math.floor(Math.random() * 2 ** 32);
