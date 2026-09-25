import { describe, expect, it } from "vitest";
import { CATEGORY_METADATA } from "../app/data";
import { EDIT_PREFIX, curatedItems, exampleKey } from "../app/categories/examples";
import { resolveCategory } from "../app/categories/registry";

const imageId = "Owoce" as const;
const textId = "Matematyka" as const;
const imageFolder = CATEGORY_METADATA[imageId].folder;
const textFolder = CATEGORY_METADATA[textId].folder;
const firstImage = exampleKey(CATEGORY_METADATA[imageId].examples[0]);
const firstText = exampleKey(CATEGORY_METADATA[textId].examples[0]);
const edit = (value: object) => JSON.stringify(value);

describe("category edits", () => {
  it("leaves a category untouched without edits", () => {
    const items = curatedItems(imageId);
    expect(items).toHaveLength(CATEGORY_METADATA[imageId].examples.length);
    expect(items.every((item) => item.status === "shipped")).toBe(true);
  });

  it("applies edited answers and deletions in place", () => {
    const overrides = {
      [imageFolder]: {
        [EDIT_PREFIX + firstImage]: edit({ kind: "edit", name: "Zmienione", alternatives: ["Inne"] }),
        [EDIT_PREFIX + exampleKey(CATEGORY_METADATA[imageId].examples[1])]: edit({ kind: "delete" }),
      },
    };
    const resolved = resolveCategory(imageId, overrides)!;
    expect(resolved.examples[0].name).toBe("Zmienione");
    expect(resolved.examples[0].alternatives).toEqual(["Inne"]);
    expect(resolved.examples).toHaveLength(CATEGORY_METADATA[imageId].examples.length - 1);
    expect(curatedItems(imageId, overrides, { includeDeleted: true })[1].status).toBe("deleted");
  });

  it("appends added picture examples only once they have a picture", () => {
    const withoutPicture = {
      [imageFolder]: { [EDIT_PREFIX + "added-1.jpg"]: edit({ kind: "add", name: "Nowy", order: 1 }) },
    };
    const count = CATEGORY_METADATA[imageId].examples.length;
    expect(resolveCategory(imageId, withoutPicture)!.examples).toHaveLength(count);

    const withPicture = {
      [imageFolder]: { ...withoutPicture[imageFolder], "added-1.jpg": "https://example.com/x.webp" },
    };
    const examples = resolveCategory(imageId, withPicture)!.examples;
    expect(examples).toHaveLength(count + 1);
    expect(examples.at(-1)).toMatchObject({ name: "Nowy", src: "https://example.com/x.webp" });
  });

  it("edits and adds text examples", () => {
    const overrides = {
      [textFolder]: {
        [EDIT_PREFIX + firstText]: edit({ kind: "edit", name: "5", text: "2 + 3" }),
        [EDIT_PREFIX + "added-2"]: edit({ kind: "add", name: "4", text: "2 + 2", order: 2 }),
      },
    };
    const examples = resolveCategory(textId, overrides)!.examples;
    expect(examples[0]).toMatchObject({ name: "5", text: "2 + 3" });
    expect(examples.at(-1)).toMatchObject({ name: "4", text: "2 + 2" });
  });

  it("ignores malformed edit entries", () => {
    const overrides = { [imageFolder]: { [EDIT_PREFIX + firstImage]: "{nope" } };
    expect(resolveCategory(imageId, overrides)!.examples).toHaveLength(
      CATEGORY_METADATA[imageId].examples.length
    );
  });
});

describe("example keys", () => {
  it("are unique within every category", () => {
    for (const [id, meta] of Object.entries(CATEGORY_METADATA)) {
      const keys = meta.examples.map(exampleKey);
      expect(new Set(keys).size, id).toBe(keys.length);
    }
  });
});
