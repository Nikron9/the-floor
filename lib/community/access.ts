import { cookies } from "next/headers";

import { isAdmin } from "./adminSession";
import type { StoredCategory } from "./db";
import { readKey } from "./identity";
import { isValidPinToken, pinToken } from "./pin";
import type { CategoryAccess } from "./types";

/**
 * Who may do what to one category, worked out from the request's cookies.
 *
 * Three ways in: the author's identity cookie, the admin session, or a PIN
 * unlock for this particular category. The first two can do everything; a
 * PIN editor can change the items but can't delete the category or change
 * the PIN -- a leaked PIN should cost some pictures, not the category.
 */

/**
 * One cookie per unlocked category, scoped by path to that category's API.
 *
 * The browser keeps same-named cookies with different paths apart and only
 * sends the one matching the request, so unlocking ten categories doesn't
 * attach ten tokens to every request the site makes.
 */
const COOKIE = "the-floor-community-pin";

const cookiePath = (categoryId: string) =>
  `/api/community/categories/${categoryId}`;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
} as const;

export type Access = CategoryAccess & {
  /** The caller's identity key, if they have one. */
  key: string | undefined;
  canEdit: boolean;
  canManage: boolean;
};

export async function accessTo(category: StoredCategory): Promise<Access> {
  const key = await readKey();
  const isOwner = Boolean(key) && category.authorKey === key;
  const admin = await isAdmin();
  const token = (await cookies()).get(COOKIE)?.value;
  const isPinEditor = isValidPinToken(token, category.editPinHash, category.id);

  return {
    key,
    isOwner,
    isAdmin: admin,
    isPinEditor,
    canEdit: isOwner || admin || isPinEditor,
    canManage: isOwner || admin,
  };
}

/** After a right PIN. Only valid inside a Route Handler. */
export async function grantPinAccess(category: StoredCategory): Promise<void> {
  if (!category.editPinHash) return;
  (await cookies()).set(COOKIE, pinToken(category.editPinHash, category.id), {
    ...COOKIE_OPTIONS,
    path: cookiePath(category.id),
  });
}

/** "Lock editing" on this device. Only valid inside a Route Handler. */
export async function revokePinAccess(categoryId: string): Promise<void> {
  (await cookies()).set(COOKIE, "", {
    ...COOKIE_OPTIONS,
    path: cookiePath(categoryId),
    maxAge: 0,
  });
}
