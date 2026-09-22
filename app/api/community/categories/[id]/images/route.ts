import { repo } from "@/lib/community/db";
import { fail, handle, json } from "@/lib/community/http";
import { imageKey } from "@/lib/community/ids";
import { readKey } from "@/lib/community/identity";
import { isAdmin } from "@/lib/community/adminSession";
import { LIMITS } from "@/lib/community/config";
import { fetchSourceImage, normalizeImage } from "@/lib/community/images";
import { imageStore } from "@/lib/community/storage";
import { cleanText } from "@/lib/community/validate";
import type { ImageCredit } from "@/lib/community/types";

type Params = { params: Promise<{ id: string }> };

/**
 * Attach one image to one item.
 *
 * Everything the free tier depends on happens here: the source is size-checked,
 * re-encoded to a bounded WebP, and stored under a content-hashed key. Nothing
 * a client sends is trusted as an image URL -- the only way a published
 * category gets a picture is by going through this route, which is why
 * `parseItems` refuses to read image fields off the request.
 *
 * Accepts either a multipart upload (`file`) or a URL to fetch (`sourceUrl`).
 *
 * Owner or admin: the admin's whole job is replacing a picture that shouldn't
 * be there, and it goes through the same normalisation as everything else.
 */
export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);
    if ((!key || category.authorKey !== key) && !(await isAdmin())) {
      return fail("To nie jest twoja kategoria.", 403);
    }

    const form = await request.formData().catch(() => undefined);
    if (!form) return fail("Oczekiwano formularza multipart.");

    const itemId = cleanText(form.get("itemId"));
    const item = category.items.find((candidate) => candidate.id === itemId);
    if (!item) return fail("W tej kategorii nie ma elementu o takim identyfikatorze.", 404);

    let source: Buffer;
    let credit: ImageCredit | null = null;

    const file = form.get("file");
    const sourceUrl = cleanText(form.get("sourceUrl"));

    if (file instanceof File) {
      if (file.size > LIMITS.maxSourceImageBytes) {
        return fail("Ten plik jest za duży.");
      }
      source = Buffer.from(await file.arrayBuffer());
    } else if (sourceUrl) {
      source = await fetchSourceImage(sourceUrl);
    } else {
      return fail("Wyślij plik albo sourceUrl.");
    }

    // Attribution travels with the image so the category page can credit
    // Wikimedia/Openverse contributors, which their licences require.
    const creditSource = cleanText(form.get("creditSource"));
    if (creditSource) {
      credit = {
        source: creditSource,
        sourceUrl: cleanText(form.get("creditSourceUrl")) || null,
        author: cleanText(form.get("creditAuthor")) || null,
        license: cleanText(form.get("creditLicense")) || null,
      };
    }

    const normalized = await normalizeImage(source);
    const storageKey = imageKey(category.id, item.id, normalized.hash);
    const url = await imageStore().put(
      storageKey,
      normalized.buffer,
      "image/webp"
    );

    const previousKey = item.imageKey;

    // Patch just this item. The grid uploads several at once, and rewriting
    // the whole array here would drop whatever the other requests just wrote.
    const saved = await repo().updateItem(id, item.id, {
      imageKey: storageKey,
      imageUrl: url,
      width: normalized.width,
      height: normalized.height,
      credit,
    });
    if (!saved) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    // Replacing an image leaves the old object behind otherwise, and storage
    // is the one budget this feature can actually blow.
    if (previousKey && previousKey !== storageKey) {
      await imageStore().remove(previousKey);
    }

    return json({
      item: saved.items.find((candidate) => candidate.id === item.id),
      bytes: normalized.bytes,
    });
  });
}

/** Detach an image without deleting the item. Owner or admin. */
export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const key = await readKey();
    const category = await repo().get(id);

    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);
    if ((!key || category.authorKey !== key) && !(await isAdmin())) {
      return fail("To nie jest twoja kategoria.", 403);
    }

    const itemId = new URL(request.url).searchParams.get("itemId") ?? "";
    const item = category.items.find((candidate) => candidate.id === itemId);
    if (!item) return fail("W tej kategorii nie ma elementu o takim identyfikatorze.", 404);

    const saved = await repo().updateItem(id, item.id, {
      imageKey: null,
      imageUrl: null,
      width: null,
      height: null,
      credit: null,
    });
    if (!saved) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    if (item.imageKey) await imageStore().remove(item.imageKey);

    return json({ item: saved.items.find((candidate) => candidate.id === item.id) });
  });
}
