import { isAdmin } from "@/lib/community/adminSession";
import { LIMITS } from "@/lib/community/config";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { hashPin, parsePin, verifyPin } from "@/lib/community/pin";
import { grantCuratedPin, revokeCuratedPin } from "@/lib/curated/access";
import { curatedRepo } from "@/lib/curated/overrides";

const WINDOW_MS = LIMITS.pinAttemptWindowMinutes * 60 * 1000;

/**
 * Unlock picture editing in the built-in categories with the shared PIN.
 * Attempts are counted before checking, as for community categories.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson(request);
    const attempt = typeof body.pin === "string" ? body.pin.trim() : "";
    if (!attempt) return fail("Wpisz PIN.");

    const claimed = await curatedRepo().claimPinAttempt(
      new Date(Date.now() - WINDOW_MS).toISOString()
    );
    if (!claimed.editPinHash) {
      return fail("PIN nie jest jeszcze ustawiony. Ustawia go administrator.", 409);
    }

    if (claimed.attempts > LIMITS.pinAttemptsPerWindow) {
      const retryAt = Date.parse(claimed.windowStartedAt ?? "") + WINDOW_MS;
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

    await curatedRepo().clearPinAttempts();
    await grantCuratedPin(claimed.editPinHash);
    return json({ unlocked: true });
  });
}

/** Set or change the shared PIN. Admin only; signs every PIN editor out. */
export async function PUT(request: Request) {
  return handle(async () => {
    if (!(await isAdmin())) return fail("PIN może ustawić tylko administrator.", 403);
    const body = await readJson(request);
    await curatedRepo().setPinHash(hashPin(parsePin(body.pin)));
    return json({ saved: true });
  });
}

/** Lock editing again on this device. */
export async function DELETE() {
  return handle(async () => {
    await revokeCuratedPin();
    return json({ locked: true });
  });
}
