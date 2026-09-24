import { handle, json } from "@/lib/community/http";
import { curatedRepo } from "@/lib/curated/overrides";

/**
 * Every picture replacement for the built-in categories, as
 * `{ [folder]: { [image]: src } }`. Public: it only says which picture to show.
 * Not cached, so a fix made a minute before the game shows up in it.
 */
export async function GET() {
  return handle(async () => {
    const overrides: Record<string, Record<string, string>> = {};
    for (const o of await curatedRepo().list()) {
      (overrides[o.folder] ??= {})[o.image] = o.imageUrl;
    }
    const response = json({ overrides });
    response.headers.set("Cache-Control", "no-store");
    return response;
  });
}
