import type { Answers } from "./data/types";

/**
 * Every accepted answer for an example, most fitting first and without
 * duplicates (compared case-insensitively). The first entry is the main answer.
 */
export function answerList(answers: Answers): string[] {
  const ordered = [
    answers.pl,
    ...(answers.plAlt ?? []),
    answers.properPl,
    answers.properEn,
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ordered) {
    const value = raw?.trim();
    if (!value) continue;
    const key = value.toLocaleLowerCase("pl");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  // The main answer is the first of pl / properPl / properEn, even when a
  // Polish alternative is listed before it.
  const main = [answers.pl, answers.properPl, answers.properEn]
    .map((v) => v?.trim())
    .find(Boolean);
  if (main && out[0] !== main) {
    return [main, ...out.filter((v) => v !== main)];
  }
  return out;
}

/** The main answer: what the projector reveals. */
export function primaryAnswer(answers: Answers): string {
  return answerList(answers)[0] ?? "";
}
