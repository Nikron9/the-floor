import { describe, expect, it } from "vitest";

import type { FloorData } from "../app/data";
import {
  markDrawn,
  planDraw,
  winnerHasPlayed,
} from "../app/projector/randomizer";

const tile = (person: string, hasPlayed = false, n = 0): FloorData => ({
  person,
  category: `${person}-${n}`,
  hasPlayed,
  isStillInTheGame: true,
});

describe("planDraw", () => {
  it("prefers the players with the smallest territory", () => {
    const board = [tile("Anna", false, 1), tile("Anna", false, 2), tile("Bartek"), tile("Celina")];
    expect(planDraw(board).candidates.sort()).toEqual(["Bartek", "Celina"]);
  });

  it("draws players, not tiles", () => {
    const board = [tile("Anna", false, 1), tile("Anna", false, 2), tile("Anna", false, 3), tile("Bartek")];
    expect(planDraw(board).eligible.sort()).toEqual(["Anna", "Bartek"]);
  });

  it("skips anyone who has played, reading the flag per person", () => {
    // Anna's second tile came from a merge and still says false.
    const board = [tile("Anna", true, 1), tile("Anna", false, 2), tile("Bartek"), tile("Celina", false, 1), tile("Celina", false, 2)];
    expect(planDraw(board).candidates).toEqual(["Bartek"]);
  });

  it("skips the player who just won and passed", () => {
    const board = [tile("Anna"), tile("Bartek"), tile("Celina", false, 1), tile("Celina", false, 2)];
    expect(planDraw(board, "Anna").candidates).toEqual(["Bartek"]);
  });

  it("starts the pool over instead of doing nothing", () => {
    const board = [tile("Anna", true), tile("Bartek", true), tile("Celina", true)];
    const plan = planDraw(board, "Anna");
    expect(plan.resetPool).toBe(true);
    expect(plan.candidates.sort()).toEqual(["Bartek", "Celina"]);
  });

  it("still draws someone when only the excluded player is left", () => {
    expect(planDraw([tile("Anna", true)], "Anna").candidates).toEqual(["Anna"]);
  });
});

describe("markDrawn", () => {
  it("marks every tile of the drawn player and clears the rest on a reset", () => {
    const board = [tile("Anna", true), tile("Bartek", false, 1), tile("Bartek", false, 2)];
    const next = markDrawn(board, "Bartek", true);
    expect(next.map((p) => p.hasPlayed)).toEqual([false, true, true]);
  });
});

describe("winnerHasPlayed", () => {
  it("counts a winning challenger as played", () => {
    expect(winnerHasPlayed([tile("Anna"), tile("Bartek")], "Anna", "Anna")).toBe(true);
  });

  it("does not take a winning defender out of the draw", () => {
    expect(winnerHasPlayed([tile("Anna", true), tile("Bartek")], "Bartek", "Anna")).toBe(false);
  });

  it("keeps a defender's earlier turn", () => {
    expect(winnerHasPlayed([tile("Anna", true), tile("Bartek", true)], "Bartek", "Anna")).toBe(true);
  });
});
