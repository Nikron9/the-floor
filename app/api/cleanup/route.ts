import { LIMITS, isProduction } from "@/lib/shared/config";
import { fail, handle, json } from "@/lib/shared/http";
import { imageStore } from "@/lib/shared/storage";
import { curatedRepo } from "@/lib/curated/overrides";

/**
 * The job that keeps image storage honest.
 *
 * Removing or replacing a curated image is deliberately best-effort so a
 * failed cleanup can't fail someone's save, which means a failed delete leaves
 * the object behind with nothing pointing at it. This sweeps those orphans --
 * including every picture left over from the removed community categories.
 *
 * Runs daily via `vercel.json`. Vercel signs cron requests with CRON_SECRET,
 * and in production this refuses to run without it -- otherwise it's an
 * unauthenticated endpoint that deletes things.
 */
export const maxDuration = 300;

const authorized = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET?.trim();

  // Vercel sends `Authorization: Bearer $CRON_SECRET` when the variable is set.
  if (secret) {
    return request.headers.get("authorization") === `Bearer ${secret}`;
  }

  // Without a secret, allow it only outside production so the job can be
  // exercised locally. In production a missing secret is a misconfiguration,
  // not a reason to run unauthenticated.
  return !isProduction();
};

export async function GET(request: Request) {
  return handle(async () => {
    if (!authorized(request)) {
      return fail("Brak autoryzacji.", 401);
    }

    const store = imageStore();

    // If this throws we never reach the delete loop, which is the point: a
    // partial set would make live images look orphaned.
    const referenced = await curatedRepo().allImageKeys();
    const objects = await store.list();

    const graceCutoff = Date.now() - LIMITS.orphanGraceHours * 60 * 60 * 1000;
    const orphans = objects.filter(
      (object) =>
        !referenced.has(object.key) &&
        // An upload is written before the row that references it, so anything
        // recent might simply be mid-flight.
        object.uploadedAt.getTime() < graceCutoff
    );

    const toDelete = orphans.slice(0, LIMITS.maxDeletesPerRun);
    await Promise.all(toDelete.map((object) => store.remove(object.key)));

    const summary = {
      objectsScanned: objects.length,
      orphansFound: orphans.length,
      orphansDeleted: toDelete.length,
      // Surfaced rather than silently truncated: if this is ever non-zero the
      // cap is doing something and someone should look at why.
      orphansSkippedByCap: orphans.length - toDelete.length,
      store: store.describe(),
    };

    console.log("[images] cleanup", summary);
    return json(summary);
  });
}
