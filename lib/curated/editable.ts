import { CATEGORY_METADATA } from "../../app/data";
import { exampleKey, isImageCategory } from "../../app/categories/examples";
import { curatedFolders, findCuratedImage, type CuratedImage } from "./catalog";
import { curatedRepo } from "./overrides";

/**
 * Which examples of a built-in category can be edited: every shipped one
 * (by its key) and every one added in the app. Keeps the API from creating
 * edits for keys nothing refers to.
 */

export const shippedExampleKeys = (folder: string): Set<string> | undefined => {
  const category = curatedFolders().get(folder);
  if (!category) return undefined;
  return new Set(
    (CATEGORY_METADATA[category].examples as Array<Parameters<typeof exampleKey>[0]>).map(
      exampleKey
    )
  );
};

/** A picture that may be replaced: a shipped one, or an added example's. */
export const findEditableImage = async (
  folder: string,
  image: string
): Promise<CuratedImage | undefined> => {
  const shipped = findCuratedImage(folder, image);
  if (shipped) return shipped;

  const category = curatedFolders().get(folder);
  if (!category || !isImageCategory(category)) return undefined;
  const added = await curatedRepo().getEdit(folder, image);
  if (added?.edit.kind !== "add") return undefined;
  return {
    category,
    categoryName: CATEGORY_METADATA[category].name,
    folder,
    image,
    name: added.edit.name ?? image,
  };
};
