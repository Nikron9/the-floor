import { handle, json } from "@/lib/shared/http";
import { curatedRepo } from "@/lib/curated/overrides";
import { EDIT_PREFIX } from "@/app/categories/examples";

/**
 * Every change to the built-in categories, as
 * `{ [folder]: { [image]: src, ["#" + exampleKey]: JSON edit } }`:
 * picture replacements plus added, edited and deleted examples (see
 * app/categories/examples.ts). Public: it only says what the game shows.
 * Not cached, so a fix made a minute before the game shows up in it.
 */
export async function GET() {
  return handle(async () => {
    const repo = curatedRepo();
    const [images, edits] = await Promise.all([repo.list(), repo.listEdits()]);
    const overrides: Record<string, Record<string, string>> = {};
    for (const o of images) {
      (overrides[o.folder] ??= {})[o.image] = o.imageUrl;
    }
    for (const e of edits) {
      (overrides[e.folder] ??= {})[EDIT_PREFIX + e.key] = JSON.stringify(e.edit);
    }
    const response = json({ overrides });
    response.headers.set("Cache-Control", "no-store");
    return response;
  });
}
