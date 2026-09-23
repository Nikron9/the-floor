import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import { LIMITS } from "./config";
import { InvalidInput } from "./validate";

/**
 * The edit PIN: how someone other than the author edits a category.
 *
 * The author's cookie ties a category to one browser, which is useless the
 * moment they want to fix a picture from their phone or let a friend help. So
 * a PIN is chosen when the category is created, and whoever knows it can
 * unlock editing for that one category.
 *
 * Only a salted scrypt hash is stored. Unlocking trades the PIN for a cookie
 * holding an HMAC of the category id keyed by that hash -- the client never
 * sees the hash, so it can't mint one, and changing the PIN (new salt, new
 * hash) signs every PIN editor out at once. No server secret is needed.
 *
 * A PIN is short by nature, so guessing is what actually protects it: see
 * `claimPinAttempt` in db.ts, which caps attempts per category per window.
 */

const TOKEN_LABEL = "the-floor-community-edit-pin-v1";
const SCRYPT_KEY_LENGTH = 32;

/** Digits only, `editPinMinLength`..`editPinMaxLength` of them. */
export const parsePin = (value: unknown): string => {
  const pin = typeof value === "string" ? value.trim() : "";
  const { editPinMinLength: min, editPinMaxLength: max } = LIMITS;

  if (!new RegExp(`^\\d{${min},${max}}$`).test(pin)) {
    throw new InvalidInput(`PIN musi mieć od ${min} do ${max} cyfr.`);
  }
  return pin;
};

/** `scrypt$<salt>$<hash>`, both base64. */
export const hashPin = (pin: string): string => {
  const salt = randomBytes(16);
  const hash = scryptSync(pin, salt, SCRYPT_KEY_LENGTH);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
};

export const verifyPin = (attempt: string, stored: string | null): boolean => {
  if (!attempt || !stored) return false;

  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const actual = scryptSync(attempt, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
};

/** The value the edit cookie holds for one category under its current PIN. */
export const pinToken = (storedHash: string, categoryId: string): string =>
  createHmac("sha256", storedHash)
    .update(`${TOKEN_LABEL}:${categoryId}`)
    .digest("hex");

export const isValidPinToken = (
  token: string | undefined,
  storedHash: string | null,
  categoryId: string
): boolean => {
  if (!token || !storedHash) return false;

  const left = Buffer.from(token, "utf8");
  const right = Buffer.from(pinToken(storedHash, categoryId), "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
};
