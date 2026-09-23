import { accessTo, grantPinAccess, revokePinAccess } from "@/lib/community/access";
import { LIMITS } from "@/lib/community/config";
import { repo, toView } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { hashPin, parsePin, verifyPin } from "@/lib/community/pin";

type Params = { params: Promise<{ id: string }> };

const WINDOW_MS = LIMITS.pinAttemptWindowMinutes * 60 * 1000;

/**
 * Unlock editing with the category's PIN.
 *
 * The attempt is counted before the PIN is checked -- see `claimPinAttempt`
 * -- so the budget holds however many guesses arrive at once. A right PIN
 * during a lockout is still refused; otherwise the lockout would only slow
 * down the guesses that were wrong anyway.
 */
export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    if (!category.editPinHash) {
      return fail(
        "Ta kategoria nie ma PIN-u. Edytować ją może tylko autor lub administrator.",
        409
      );
    }

    const body = await readJson(request);
    const attempt = typeof body.pin === "string" ? body.pin.trim() : "";
    // An empty submit is a slip, not a guess, so it doesn't cost an attempt.
    if (!attempt) return fail("Wpisz PIN.");

    const claimed = await repo().claimPinAttempt(
      id,
      new Date(Date.now() - WINDOW_MS).toISOString()
    );
    if (!claimed) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    if (claimed.attempts > LIMITS.pinAttemptsPerWindow) {
      const retryAt = Date.parse(claimed.windowStartedAt) + WINDOW_MS;
      const minutes = Math.max(1, Math.ceil((retryAt - Date.now()) / 60_000));
      return fail(`Za dużo prób. Spróbuj ponownie za ${minutes} min.`, 429);
    }

    if (!verifyPin(attempt, claimed.editPinHash)) {
      const left = LIMITS.pinAttemptsPerWindow - claimed.attempts;
      return fail(
        left > 0
          ? `Nieprawidłowy PIN. Pozostało prób: ${left}.`
          : `Nieprawidłowy PIN. Kolejna próba za ${LIMITS.pinAttemptWindowMinutes} min.`,
        403
      );
    }

    await repo().clearPinAttempts(id);
    // The hash the PIN was just checked against, in case it changed since
    // the category was read.
    await grantPinAccess({ ...category, editPinHash: claimed.editPinHash });

    return json({ unlocked: true });
  });
}

/**
 * Set or change the PIN. Owner or admin only: a PIN editor who could change
 * it could lock the author out of their own category.
 *
 * A new PIN gets a new salt and so a new hash, which is what every PIN
 * editor's cookie is derived from -- changing it signs them all out.
 */
export async function PUT(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    const access = await accessTo(category);
    if (!access.canManage) {
      return fail("PIN może zmienić tylko autor lub administrator.", 403);
    }

    const body = await readJson(request);
    const saved = await repo().setEditPin(id, hashPin(parsePin(body.pin)));
    if (!saved) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    return json({ category: toView(saved, 0, access) });
  });
}

/** Lock editing again on this device. */
export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    // The id becomes a cookie path; anything but a plain id isn't one of ours.
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
      return fail("Nie ma kategorii o takim identyfikatorze.", 404);
    }

    await revokePinAccess(id);
    return json({ locked: true });
  });
}
