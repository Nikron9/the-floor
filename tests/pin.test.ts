import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LIMITS } from "../lib/community/config";
import {
  hashPin,
  isValidPinToken,
  parsePin,
  pinToken,
  verifyPin,
} from "../lib/community/pin";
import { parseItems } from "../lib/community/validate";
import type { CommunityItem } from "../lib/community/types";

/**
 * The edit PIN is the only thing standing between a published category and
 * anyone who wants to vandalise it, so the properties that matter are tested
 * directly: only the hash is stored, only the right PIN verifies, the cookie
 * can't be minted without the hash, and guessing is capped.
 */
describe("edit PINs", () => {
  it("accepts 4 to 8 digits and nothing else", () => {
    expect(parsePin("1234")).toBe("1234");
    expect(parsePin(" 12345678 ")).toBe("12345678");

    for (const bad of ["123", "123456789", "12a4", "", "12 34", 1234, null]) {
      expect(() => parsePin(bad)).toThrow(/PIN/);
    }
  });

  it("stores a salted hash, never the PIN", () => {
    const first = hashPin("4821");
    const second = hashPin("4821");

    expect(first).not.toContain("4821");
    expect(first).toMatch(/^scrypt\$[^$]+\$[^$]+$/);
    // Same PIN, different salt: a leaked table doesn't show who reused one.
    expect(first).not.toBe(second);
  });

  it("verifies only the right PIN", () => {
    const stored = hashPin("4821");

    expect(verifyPin("4821", stored)).toBe(true);
    expect(verifyPin("4822", stored)).toBe(false);
    expect(verifyPin("48210", stored)).toBe(false);
    expect(verifyPin("", stored)).toBe(false);
    expect(verifyPin("4821", null)).toBe(false);
    expect(verifyPin("4821", "garbage")).toBe(false);
  });

  it("derives a cookie per category that needs the hash to forge", () => {
    const stored = hashPin("4821");
    const token = pinToken(stored, "category-a");

    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(token).not.toContain("4821");
    expect(isValidPinToken(token, stored, "category-a")).toBe(true);

    // Unlocking one category doesn't unlock another with the same PIN.
    expect(isValidPinToken(token, stored, "category-b")).toBe(false);
    expect(isValidPinToken(pinToken(hashPin("4821"), "category-a"), stored, "category-a")).toBe(false);
    expect(isValidPinToken(undefined, stored, "category-a")).toBe(false);
    expect(isValidPinToken(token, null, "category-a")).toBe(false);
  });

  it("changing the PIN signs every PIN editor out", () => {
    const before = hashPin("4821");
    const token = pinToken(before, "category-a");

    // Even re-setting the same PIN: a new salt is a new hash.
    const after = hashPin("4821");
    expect(isValidPinToken(token, after, "category-a")).toBe(false);
  });
});

describe("the wrong-PIN budget", () => {
  let workdir: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    workdir = await mkdtemp(path.join(tmpdir(), "floor-pin-"));
    process.chdir(workdir);
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(workdir, { recursive: true, force: true });
  });

  const load = async () => {
    vi.resetModules();
    return (await import("../lib/community/db")).repo();
  };

  const windowStart = () =>
    new Date(
      Date.now() - LIMITS.pinAttemptWindowMinutes * 60_000
    ).toISOString();

  it("counts every attempt, including ones that arrive together", async () => {
    const repo = await load();
    const category = await repo.create({
      name: "Locked",
      items: [],
      authorKey: "a",
      editPinHash: hashPin("4821"),
    });

    const claims = await Promise.all(
      Array.from({ length: 8 }, () =>
        repo.claimPinAttempt(category.id, windowStart())
      )
    );

    // Each parallel guess got its own number, so all but the budget are over.
    expect(claims.map((claim) => claim?.attempts).sort((a, b) => a! - b!)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(
      claims.filter((claim) => claim!.attempts > LIMITS.pinAttemptsPerWindow)
    ).toHaveLength(8 - LIMITS.pinAttemptsPerWindow);
    expect(claims[0]?.editPinHash).toBe(category.editPinHash);
  });

  it("starts a fresh window once the old one has passed", async () => {
    const repo = await load();
    const category = await repo.create({
      name: "Locked",
      items: [],
      authorKey: "a",
      editPinHash: hashPin("4821"),
    });

    await repo.claimPinAttempt(category.id, windowStart());
    await repo.claimPinAttempt(category.id, windowStart());

    // A cutoff in the future makes the current window count as expired.
    const later = new Date(Date.now() + 1000).toISOString();
    expect((await repo.claimPinAttempt(category.id, later))?.attempts).toBe(1);
  });

  it("clears after a right PIN and after a PIN change", async () => {
    const repo = await load();
    const category = await repo.create({
      name: "Locked",
      items: [],
      authorKey: "a",
      editPinHash: hashPin("4821"),
    });

    await repo.claimPinAttempt(category.id, windowStart());
    await repo.claimPinAttempt(category.id, windowStart());
    await repo.clearPinAttempts(category.id);
    expect((await repo.claimPinAttempt(category.id, windowStart()))?.attempts).toBe(1);

    const changed = await repo.setEditPin(category.id, hashPin("9999"));
    expect(changed?.editPinHash).not.toBe(category.editPinHash);
    expect((await repo.claimPinAttempt(category.id, windowStart()))?.attempts).toBe(1);
  });

  it("keeps categories made without a PIN PIN-less", async () => {
    const repo = await load();
    const category = await repo.create({ name: "Old", items: [], authorKey: "a" });

    expect(category.editPinHash).toBeNull();
    expect((await repo.get(category.id))?.editPinHash).toBeNull();
  });
});

describe("editing items", () => {
  const stored: CommunityItem[] = [
    {
      id: "a",
      name: "Apple",
      alternatives: [],
      imageKey: "k/a.webp",
      imageUrl: "https://example.com/a.webp",
      width: 800,
      height: 800,
      credit: null,
    },
    {
      id: "b",
      name: "Banana",
      alternatives: [],
      imageKey: null,
      imageUrl: "https://example.com/b.webp",
      width: 800,
      height: 800,
      credit: null,
    },
  ];

  it("keeps the picture when an item is renamed", () => {
    const [renamed] = parseItems([{ id: "a", name: "Green apple" }], {
      existing: stored,
      rejectDuplicates: true,
    });

    expect(renamed.name).toBe("Green apple");
    expect(renamed.imageUrl).toBe(stored[0].imageUrl);
    expect(renamed.imageKey).toBe(stored[0].imageKey);
  });

  it("adds a new item without a picture", () => {
    const items = parseItems(
      [{ id: "a", name: "Apple" }, { id: "b", name: "Banana" }, { name: "Cherry" }],
      { existing: stored, rejectDuplicates: true }
    );

    expect(items).toHaveLength(3);
    expect(items[2].name).toBe("Cherry");
    expect(items[2].imageUrl).toBeNull();
    expect(["a", "b"]).not.toContain(items[2].id);
  });

  it("refuses a rename that collides, instead of dropping the item", () => {
    expect(() =>
      parseItems(
        [{ id: "a", name: "Apple" }, { id: "b", name: "apple" }],
        { existing: stored, rejectDuplicates: true }
      )
    ).toThrow(/już jest/);

    // Creating still drops duplicates quietly, as the AI suggester needs.
    expect(parseItems([{ name: "Apple" }, { name: "apple" }])).toHaveLength(1);
  });

  it("won't let two items claim one picture by sharing an id", () => {
    const items = parseItems(
      [{ id: "a", name: "Apple" }, { id: "a", name: "Impostor" }],
      { existing: stored, rejectDuplicates: true }
    );

    expect(items[0].imageUrl).toBe(stored[0].imageUrl);
    expect(items[1].id).not.toBe("a");
    expect(items[1].imageUrl).toBeNull();
    expect(items[1].imageKey).toBeNull();
  });
});
