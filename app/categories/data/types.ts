/**
 * Shapes shared by every curated category file in this folder.
 *
 * Kept apart from app/data.ts so the category files don't import the module
 * that imports them.
 */
export type ImageExample = {
  name: string;
  image: string;
  alternatives: string[];
};

export type TextExample = {
  name: string;
  text: string;
  alternatives: string[];
};

export type CategoryMetadata = {
  name: string;
  folder: string;
  examples: ImageExample[] | TextExample[];
};
