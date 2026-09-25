import { isAdmin } from "@/lib/shared/adminSession";
import { fail, handle, json } from "@/lib/shared/http";
import { findCuratedImage } from "@/lib/curated/catalog";
import { curatedRepo, sha256 } from "@/lib/curated/overrides";

/**
 * Every replacement, for the admin, with two flags worth acting on:
 * `repoChanged` -- the shipped file differs from the one that was replaced
 * (a later deploy changed it; the replacement still wins), and `orphaned` --
 * the example no longer exists in the repo, so the replacement is unused.
 */
export async function GET(request: Request) {
  return handle(async () => {
    if (!(await isAdmin())) return fail("Tylko dla administratora.", 403);

    const overrides = await curatedRepo().list();
    const rows = await Promise.all(
      overrides.map(async (o) => {
        const target = findCuratedImage(o.folder, o.image);
        let repoChanged = false;
        if (target && o.originalHash) {
          try {
            const url = new URL(
              `/images/${encodeURIComponent(o.folder)}/${encodeURIComponent(o.image)}`,
              request.url
            );
            const response = await fetch(url, { cache: "no-store" });
            if (response.ok) {
              repoChanged =
                sha256(new Uint8Array(await response.arrayBuffer())) !== o.originalHash;
            }
          } catch {
            // Unknown is not "changed"; the flag is advisory.
          }
        }
        return {
          ...o,
          categoryName: target?.categoryName ?? null,
          name: target?.name ?? null,
          orphaned: !target,
          repoChanged,
        };
      })
    );

    return json({ overrides: rows });
  });
}
