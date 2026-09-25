import type { ResolvedCategory } from "./registry";

/**
 * What the projector explains before a round starts. Categories can set their
 * own `instruction` (see CategoryMetadata); otherwise it follows from whether
 * the round shows pictures or text. The returned strings are UI text, so they
 * are Polish.
 */
export type RoundInstruction = {
  kind: "image" | "text";
  /** Short label for the kind of prompt: "Obrazki" or "Tekst". */
  kindLabel: string;
  /** What appears on screen and what the players have to say. */
  prompt: string;
  /** Category-specific rules: accepted answers, difficulty, tolerances. */
  details: string[];
};

const DEFAULT_PROMPT = {
  image: "Na ekranie pojawi się obrazek. Powiedz, co przedstawia.",
  text: "Na ekranie pojawi się tekst. Podaj właściwą odpowiedź.",
} as const;

export const roundInstruction = (
  category: Pick<ResolvedCategory, "examples" | "instruction" | "details">
): RoundInstruction => {
  const kind = category.examples.some((example) => "text" in example)
    ? "text"
    : "image";

  return {
    kind,
    kindLabel: kind === "text" ? "Tekst" : "Obrazki",
    prompt: category.instruction ?? DEFAULT_PROMPT[kind],
    details: category.details ?? [],
  };
};

/** The rules every duel follows, shown under the category prompt. */
export const ROUND_RULES = [
  "Każdy gracz ma 45 sekund na swoim zegarze.",
  "Zaczyna pretendent. Po dobrej odpowiedzi zegar przechodzi na przeciwnika.",
  "Pas pokazuje następny element, ale twój zegar biegnie dalej przez 3 sekundy.",
  "Przegrywa ten, komu pierwszemu skończy się czas.",
] as const;
