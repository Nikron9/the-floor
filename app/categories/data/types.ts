/**
 * Shapes shared by every curated category file in this folder.
 *
 * Kept apart from app/data.ts so the category files don't import the module
 * that imports them.
 */

/**
 * Accepted answers for one example, in priority order. Every field is
 * optional, but at least one of `pl`, `properPl` or `properEn` must be set.
 * The first of those that is set is the main answer; the host panel lists the
 * rest underneath in this order: pl, plAlt, properPl, properEn.
 * See app/categories/answers.ts.
 */
export type Answers = {
  /** Po polsku: the common Polish word for the thing ("Kotlet schabowy"). */
  pl?: string;
  /** Other Polish ways to say it: synonyms, short forms, nicknames. */
  plAlt?: string[];
  /** Proper name as used in Poland: a person, Polish title, character. */
  properPl?: string;
  /** English/original proper name, when it differs from `properPl`. */
  properEn?: string;
};

export type ImageExample = Answers & {
  image: string;
};

export type TextExample = Answers & {
  text: string;
};

export type CategoryMetadata = {
  name: string;
  folder: string;
  /**
   * Optional UI text (Polish) shown on the projector before the round starts:
   * what appears on screen and what players must answer. Without it the
   * projector uses a generic prompt for image or text categories -- see
   * app/categories/instructions.ts.
   */
  instruction?: string;
  examples: ImageExample[] | TextExample[];
};
