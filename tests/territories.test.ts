import { describe, expect, it } from "vitest";

import {
  findTerritories,
  largestRectangle,
  territoryPath,
} from "../app/projector/territories";

const board = (rows: string[]) =>
  rows.join("").split("").map((person) => ({ person }));

describe("findTerritories", () => {
  it("groups connected tiles of the same person", () => {
    const pieces = board(["AAB", "ACB", "CCB"]);
    const found = findTerritories(pieces, 3);
    const byPerson = Object.fromEntries(found.map((t) => [t.person, t.cells]));
    expect(byPerson).toEqual({ A: [0, 1, 3], B: [2, 5, 8], C: [4, 6, 7] });
  });

  it("keeps disconnected blocks of one person apart", () => {
    const found = findTerritories(board(["ABA"]), 3);
    expect(found.filter((t) => t.person === "A")).toHaveLength(2);
  });

  it("handles a short last row", () => {
    const pieces = board(["AAA", "A"]);
    expect(findTerritories(pieces, 3)).toHaveLength(1);
  });
});

describe("largestRectangle", () => {
  it("is the tile itself for a single tile", () => {
    expect(largestRectangle([4], 3)).toEqual({ col: 1, row: 1, cols: 1, rows: 1 });
  });

  it("stays inside an L shape", () => {
    // X X .
    // X . .
    // X . .
    const rect = largestRectangle([0, 1, 3, 6], 3);
    expect(rect.cols * rect.rows).toBe(3);
    expect(rect).toEqual({ col: 0, row: 0, cols: 1, rows: 3 });
  });

  it("prefers the wide one when areas and distances tie", () => {
    const rect = largestRectangle([0, 1, 3, 4], 3); // 2x2 block
    expect(rect).toEqual({ col: 0, row: 0, cols: 2, rows: 2 });
  });

  it("only covers owned cells", () => {
    const cells = [0, 1, 2, 3, 5, 6, 7, 8]; // a ring around the centre
    const rect = largestRectangle(cells, 3);
    for (let r = rect.row; r < rect.row + rect.rows; r += 1) {
      for (let c = rect.col; c < rect.col + rect.cols; c += 1) {
        expect(cells).toContain(r * 3 + c);
      }
    }
  });
});

describe("territoryPath", () => {
  const geometry = { cols: 3, rows: 3, cellWidth: 100, cellHeight: 50, gapX: 10, gapY: 10 };

  it("draws one closed loop for a block", () => {
    const path = territoryPath([0, 1, 3], geometry, 0);
    expect(path.match(/M/g)).toHaveLength(1);
    // An L has six corners.
    expect(path.match(/Q/g)).toHaveLength(6);
    // Spans the gap between the two top tiles: right edge at 100 + 10 + 100.
    expect(path).toContain("210");
  });

  it("draws a hole when a block surrounds another", () => {
    const path = territoryPath([0, 1, 2, 3, 5, 6, 7, 8], geometry, 4);
    expect(path.match(/M/g)).toHaveLength(2);
  });
});
