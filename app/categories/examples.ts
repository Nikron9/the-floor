import {
  CATEGORY_METADATA,
  type Category,
  type ImageExample,
  type TextExample,
} from "../data";
import { answerList } from "./answers";

/**
 * The examples of a curated category as the game sees them: the shipped list
 * from `app/categories/data/`, with the edits made in the app layered on top.
 *
 * Edits travel in the same `{ [folder]: { [key]: value } }` map as the picture
 * replacements (see useCuratedOverrides), under keys starting with "#", so
 * presenter and projector share them through the same cache:
 *   "#<exampleKey>" -> JSON ExampleEdit
 * A picture for an added example is an ordinary replacement keyed by the added
 * example's key (e.g. "added-3f9a1c2b.jpg").
 */

export const EDIT_PREFIX = "#";

export type ExampleEdit = {
  kind: "add" | "edit" | "delete";
  /** Main answer (add/edit). */
  name?: string;
  /** Other accepted answers (add/edit). */
  alternatives?: string[];
  /** Prompt text for text categories (add/edit). */
  text?: string;
  /** Adds are listed in the order they were made. */
  order?: number;
};

export type CuratedItem = {
  /** Stable id: the shipped image file, `text:<prompt>`, or an added key. */
  key: string;
  name: string;
  alternatives: string[];
  /** Text categories. */
  text?: string;
  /** Image categories: the picture's key in the folder and where it is. */
  image?: string;
  src?: string;
  status: "shipped" | "edited" | "added" | "deleted";
};

type FolderMap = Readonly<Record<string, string>> | undefined;

export const exampleKey = (example: ImageExample | TextExample): string =>
  "image" in example ? example.image : `text:${example.text}`;

export const isImageCategory = (id: Category): boolean =>
  (CATEGORY_METADATA[id].examples as Array<ImageExample | TextExample>).some(
    (example) => "image" in example
  );

export const parseEdits = (map: FolderMap): Map<string, ExampleEdit> => {
  const edits = new Map<string, ExampleEdit>();
  for (const [key, value] of Object.entries(map ?? {})) {
    if (!key.startsWith(EDIT_PREFIX)) continue;
    try {
      const edit = JSON.parse(value) as ExampleEdit;
      if (edit && (edit.kind === "add" || edit.kind === "edit" || edit.kind === "delete")) {
        edits.set(key.slice(EDIT_PREFIX.length), edit);
      }
    } catch {
      // A malformed entry is ignored rather than breaking the category.
    }
  }
  return edits;
};

const clean = (values: unknown): string[] =>
  Array.isArray(values)
    ? values.map((v) => String(v ?? "").trim()).filter(Boolean)
    : [];

/**
 * Every example of the category with edits applied, shipped order first and
 * added examples at the end. Deleted ones are left out unless asked for (the
 * editor shows them so they can be restored).
 */
export const curatedItems = (
  id: Category,
  overrides: Readonly<Record<string, Readonly<Record<string, string>>>> = {},
  { includeDeleted = false }: { includeDeleted?: boolean } = {}
): CuratedItem[] => {
  const meta = CATEGORY_METADATA[id];
  const folder = meta.folder;
  const map: FolderMap = Object.prototype.hasOwnProperty.call(overrides, folder)
    ? overrides[folder]
    : undefined;
  const picture = (image: string): string | undefined =>
    map && Object.prototype.hasOwnProperty.call(map, image) ? map[image] : undefined;
  const edits = parseEdits(map);
  const imageCategory = isImageCategory(id);

  const shipped: CuratedItem[] = [];
  for (const example of meta.examples as Array<ImageExample | TextExample>) {
    const key = exampleKey(example);
    const edit = edits.get(key);
    if (edit?.kind === "delete" && !includeDeleted) continue;

    const [name = "", ...alternatives] = answerList(example);
    const edited = edit?.kind === "edit" && edit.name?.trim();
    const item: CuratedItem = {
      key,
      name: edited ? edit!.name!.trim() : name,
      alternatives: edited ? clean(edit!.alternatives) : alternatives,
      status: edit?.kind === "delete" ? "deleted" : edited ? "edited" : "shipped",
    };
    if ("text" in example) {
      item.text = (edited && edit!.text?.trim()) || example.text;
    } else {
      item.image = example.image;
      item.src = picture(example.image) ?? `/images/${folder}/${example.image}`;
    }
    shipped.push(item);
  }

  const added: CuratedItem[] = [...edits]
    .filter(([, edit]) => edit.kind === "add" && edit.name?.trim())
    .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
    .map(([key, edit]) => ({
      key,
      name: edit.name!.trim(),
      alternatives: clean(edit.alternatives),
      status: "added" as const,
      ...(imageCategory
        ? { image: key, src: picture(key) }
        : { text: edit.text?.trim() || "" }),
    }));

  return [...shipped, ...added];
};
