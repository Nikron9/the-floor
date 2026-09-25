import { fail, handle, json } from "@/lib/shared/http";
import {
  fetchSourceImage,
  normalizeImage,
  validateLinkedImage,
} from "@/lib/shared/images";
import { LIMITS } from "@/lib/shared/config";
import { imageStore } from "@/lib/shared/storage";
import type { ImageCredit } from "@/lib/shared/types";
import { cleanText } from "@/lib/shared/validate";
import { curatedAccess } from "@/lib/curated/access";
import { curatedImageKey } from "@/lib/curated/catalog";
import { findEditableImage } from "@/lib/curated/editable";
import { curatedRepo, sha256 } from "@/lib/curated/overrides";

/**
 * Replace the picture of one example in a built-in category, or go back to
 * the shipped file. Accepts: a
 * link the browser verified (`linkUrl`), an upload (`file`) or a URL for the
 * server to fetch (`sourceUrl`), and runs them through the same checks.
 */

/** SHA-256 of the shipped file, so a later deploy that changes it can be flagged. */
const shippedHash = async (
  request: Request,
  folder: string,
  image: string
): Promise<string | null> => {
  try {
    const url = new URL(
      `/images/${encodeURIComponent(folder)}/${encodeURIComponent(image)}`,
      request.url
    );
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return sha256(new Uint8Array(await response.arrayBuffer()));
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  return handle(async () => {
    if (!(await curatedAccess()).canEdit) {
      return fail("Aby edytować obrazki, odblokuj edycję PIN-em.", 403);
    }

    const form = await request.formData().catch(() => undefined);
    if (!form) return fail("Oczekiwano formularza multipart.");

    const target = await findEditableImage(
      cleanText(form.get("folder")),
      cleanText(form.get("image"))
    );
    if (!target) return fail("Nie ma takiego obrazka we wbudowanych kategoriach.", 404);

    let credit: ImageCredit | null = null;
    const creditSource = cleanText(form.get("creditSource"));
    if (creditSource) {
      credit = {
        source: creditSource,
        sourceUrl: cleanText(form.get("creditSourceUrl")) || null,
        author: cleanText(form.get("creditAuthor")) || null,
        license: cleanText(form.get("creditLicense")) || null,
      };
    }

    const repo = curatedRepo();
    const previous = await repo.get(target.folder, target.image);
    const originalHash = await shippedHash(request, target.folder, target.image);
    const linkUrl = cleanText(form.get("linkUrl"));

    let saved;
    if (linkUrl) {
      const linked = validateLinkedImage(linkUrl, form.get("linkWidth"), form.get("linkHeight"));
      saved = await repo.upsert({
        folder: target.folder,
        image: target.image,
        imageUrl: linked.url,
        imageKey: null,
        width: linked.width,
        height: linked.height,
        credit,
        originalHash,
      });
    } else {
      const file = form.get("file");
      const sourceUrl = cleanText(form.get("sourceUrl"));
      let source: Buffer;
      if (file instanceof File) {
        if (file.size > LIMITS.maxSourceImageBytes) return fail("Ten plik jest za duży.");
        source = Buffer.from(await file.arrayBuffer());
      } else if (sourceUrl) {
        source = await fetchSourceImage(sourceUrl);
      } else {
        return fail("Wyślij plik albo sourceUrl.");
      }

      const normalized = await normalizeImage(source);
      const key = curatedImageKey(target.folder, target.image, normalized.hash);
      const url = await imageStore().put(key, normalized.buffer, "image/webp");
      saved = await repo.upsert({
        folder: target.folder,
        image: target.image,
        imageUrl: url,
        imageKey: key,
        width: normalized.width,
        height: normalized.height,
        credit,
        originalHash,
      });
    }

    if (previous?.imageKey && previous.imageKey !== saved.imageKey) {
      await imageStore().remove(previous.imageKey);
    }

    return json({ override: saved });
  });
}

/** Go back to the picture shipped in the repo. */
export async function DELETE(request: Request) {
  return handle(async () => {
    if (!(await curatedAccess()).canEdit) {
      return fail("Aby edytować obrazki, odblokuj edycję PIN-em.", 403);
    }

    const params = new URL(request.url).searchParams;
    const target = await findEditableImage(params.get("folder") ?? "", params.get("image") ?? "");
    if (!target) return fail("Nie ma takiego obrazka we wbudowanych kategoriach.", 404);

    const repo = curatedRepo();
    const previous = await repo.get(target.folder, target.image);
    await repo.remove(target.folder, target.image);
    if (previous?.imageKey) await imageStore().remove(previous.imageKey);

    return json({ reverted: true });
  });
}
