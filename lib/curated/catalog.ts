import { primaryAnswer } from "../../app/categories/answers";
import { CATEGORY_METADATA, type Category } from "../../app/data";

/**
 * Looking up a curated example by the two things an override is keyed on.
 *
 * Only files that a curated category actually references can be overridden,
 * so the API can't be used to plant arbitrary keys.
 */

export type CuratedImage = {
  category: Category;
  categoryName: string;
  folder: string;
  image: string;
  name: string;
};

export const curatedFolders = (): Map<string, Category> => {
  const folders = new Map<string, Category>();
  for (const category of Object.keys(CATEGORY_METADATA) as Category[]) {
    folders.set(CATEGORY_METADATA[category].folder, category);
  }
  return folders;
};

export const findCuratedImage = (
  folder: string,
  image: string
): CuratedImage | undefined => {
  const category = curatedFolders().get(folder);
  if (!category) return undefined;

  const meta = CATEGORY_METADATA[category];
  for (const example of meta.examples) {
    if ("image" in example && example.image === image) {
      return { category, categoryName: meta.name, folder, image, name: primaryAnswer(example) };
    }
  }
  return undefined;
};

/** Storage keys must match the image route's pattern: alphanumeric segments. */
const alnum = (value: string) => value.replace(/[^A-Za-z0-9]/g, "") || "x";

export const curatedImageKey = (folder: string, image: string, hash: string) =>
  `categories/curated${alnum(folder)}/${alnum(image.replace(/\.[^.]+$/, ""))}-${hash}.webp`;
