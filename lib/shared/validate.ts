export class InvalidInput extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInput";
  }
}

/** Collapses whitespace and strips control characters. */
export const cleanText = (value: unknown): string =>
  typeof value === "string"
    // eslint-disable-next-line no-control-regex
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim()
    : "";
