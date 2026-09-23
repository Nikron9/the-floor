import { describe, expect, it } from "vitest";

import { boardLayout, neighbourIndices } from "../app/projector/boardLayout";

describe("boardLayout", () => {
  it.each([
    [21, 7, 3],
    [24, 6, 4],
    [25, 5, 5],
    [36, 6, 6],
    [30, 6, 5],
    [20, 5, 4],
    [12, 4, 3],
    [16, 4, 4],
  ])("%i players fill an exact %ix%i board", (count, cols, rows) => {
    expect(boardLayout(count)).toEqual({ cols, rows });
  });

  it("prefers a few empty squares over a long strip", () => {
    // 22 = 11x2 and 23 is prime; both should look like a board.
    expect(boardLayout(22)).toEqual({ cols: 6, rows: 4 });
    expect(boardLayout(23)).toEqual({ cols: 6, rows: 4 });
  });

  it("always fits everyone, never leaves a whole row empty, stays landscape", () => {
    for (let count = 1; count <= 100; count += 1) {
      const { cols, rows } = boardLayout(count);
      expect(cols * rows).toBeGreaterThanOrEqual(count);
      expect((rows - 1) * cols).toBeLessThan(count);
      expect(cols).toBeGreaterThanOrEqual(rows);
    }
  });
});

describe("neighbourIndices", () => {
  it("follows the actual column count", () => {
    // 7x3: index 8 is row 1, col 1.
    expect(neighbourIndices(8, 21, 7).sort((a, b) => a - b)).toEqual([1, 7, 9, 15]);
  });

  it("does not wrap across row edges", () => {
    expect(neighbourIndices(6, 21, 7).sort((a, b) => a - b)).toEqual([5, 13]);
    expect(neighbourIndices(7, 21, 7).sort((a, b) => a - b)).toEqual([0, 8, 14]);
  });

  it("ignores the empty squares at the end of a partial last row", () => {
    // 23 on 6x4: the last row holds indices 18-22, square 23 is empty.
    expect(neighbourIndices(22, 23, 6).sort((a, b) => a - b)).toEqual([16, 21]);
    expect(neighbourIndices(17, 23, 6).sort((a, b) => a - b)).toEqual([11, 16]);
  });
});
