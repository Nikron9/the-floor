import { cookies } from "next/headers";

import { isAdmin } from "../shared/adminSession";
import { isValidPinToken, pinToken } from "../shared/pin";
import { curatedRepo } from "./overrides";

/**
 * Who may replace pictures in the built-in categories: the admin, or anyone
 * who unlocked editing with the shared PIN. The PIN cookie is an HMAC keyed
 * by the stored hash (see lib/shared/pin.ts), so changing the PIN signs
 * every PIN editor out at once.
 */

const COOKIE = "the-floor-curated-pin";
/** Stands in for the category id in the shared token derivation. */
const SCOPE = "curated";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/curated",
  maxAge: 60 * 60 * 24 * 7,
} as const;

export type CuratedAccess = {
  isAdmin: boolean;
  isPinEditor: boolean;
  canEdit: boolean;
  hasPin: boolean;
};

export async function curatedAccess(): Promise<CuratedAccess> {
  const admin = await isAdmin();
  const hash = await curatedRepo().pinHash();
  const token = (await cookies()).get(COOKIE)?.value;
  const isPinEditor = isValidPinToken(token, hash, SCOPE);
  return { isAdmin: admin, isPinEditor, canEdit: admin || isPinEditor, hasPin: Boolean(hash) };
}

export async function grantCuratedPin(hash: string): Promise<void> {
  (await cookies()).set(COOKIE, pinToken(hash, SCOPE), COOKIE_OPTIONS);
}

export async function revokeCuratedPin(): Promise<void> {
  (await cookies()).set(COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}
