import { describe, expect, it } from "vitest";
import { isHalloweenSeason, resolveTheme } from "../app/theme";

const day = (month: number, date: number) => new Date(2026, month - 1, date, 12);

describe("theme season", () => {
  it("is Halloween from 15 October to 15 November", () => {
    expect(isHalloweenSeason(day(10, 14))).toBe(false);
    expect(isHalloweenSeason(day(10, 15))).toBe(true);
    expect(isHalloweenSeason(day(10, 31))).toBe(true);
    expect(isHalloweenSeason(day(11, 15))).toBe(true);
    expect(isHalloweenSeason(day(11, 16))).toBe(false);
    expect(isHalloweenSeason(day(9, 25))).toBe(false);
  });

  it("lets an explicit choice win over the season", () => {
    expect(resolveTheme("auto", day(10, 20))).toBe("halloween");
    expect(resolveTheme("auto", day(3, 1))).toBe("classic");
    expect(resolveTheme("classic", day(10, 31))).toBe("classic");
    expect(resolveTheme("halloween", day(3, 1))).toBe("halloween");
  });
});
