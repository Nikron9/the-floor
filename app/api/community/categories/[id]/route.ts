import { imageStore } from "@/lib/community/storage";
import { accessTo } from "@/lib/community/access";
import { LIMITS } from "@/lib/community/config";
import { repo, toView } from "@/lib/community/db";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { parseItems } from "@/lib/community/validate";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    const access = await accessTo(category);

    // Drafts are only visible to whoever may edit them, and a category the
    // community has reported into the ground stops being browsable. The
    // admin sees both -- a hidden category is exactly the one they need to
    // look at.
    if (category.status === "draft" && !access.canEdit) {
      return fail("Nie ma kategorii o takim identyfikatorze.", 404);
    }
    if (category.hiddenAt && !access.canEdit) {
      return fail("Ta kategoria jest ukryta do czasu weryfikacji.", 410);
    }

    const votes = access.key ? await repo().getVotes([id], access.key) : {};
    return json({ category: toView(category, votes[id] ?? 0, access) });
  });
}

const playableCount = (items: { imageUrl: string | null }[]) =>
  items.filter((item) => item.imageUrl).length;

/** Rename, reorder, add or drop items. Owner, admin or PIN editor. */
export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    const access = await accessTo(category);
    if (!access.canEdit) {
      return fail("Aby edytować tę kategorię, odblokuj ją PIN-em.", 403);
    }

    const body = await readJson(request);
    // `existing` carries the stored image fields across, so a client can
    // reorder or rename without being able to invent an imageUrl.
    const items = parseItems(body.items, {
      existing: category.items,
      rejectDuplicates: true,
    });

    // A published category is in people's games. Emptying one out below what
    // publishing required is how a PIN gets used to troll, so only the admin
    // -- who may need to pull several bad pictures at once -- can go below.
    const before = playableCount(category.items);
    const after = playableCount(items);
    if (
      category.status === "published" &&
      !access.isAdmin &&
      after < LIMITS.minItemsToPublish &&
      after < before
    ) {
      return fail(
        `Opublikowana kategoria musi mieć co najmniej ${LIMITS.minItemsToPublish} ` +
          "elementów z obrazkami. Najpierw dodaj nowy, potem usuń stary."
      );
    }

    const keptKeys = new Set(
      items.map((item) => item.imageKey).filter(Boolean) as string[]
    );
    const orphaned = category.items
      .map((item) => item.imageKey)
      .filter((imageKey): imageKey is string => Boolean(imageKey))
      .filter((imageKey) => !keptKeys.has(imageKey));

    const saved = await repo().saveItems(id, items);
    if (!saved) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    await Promise.all(orphaned.map((imageKey) => imageStore().remove(imageKey)));

    return json({ category: toView(saved, 0, access) });
  });
}

/**
 * Owner or admin -- not a PIN editor, so a leaked PIN can't take the whole
 * category down. Takes the images with it.
 */
export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const { id } = await params;
    const category = await repo().get(id);
    if (!category) return fail("Nie ma kategorii o takim identyfikatorze.", 404);

    if (!(await accessTo(category)).canManage) {
      return fail("Kategorię może usunąć tylko jej autor lub administrator.", 403);
    }

    await repo().remove(id);
    await Promise.all(
      category.items
        .map((item) => item.imageKey)
        .filter((imageKey): imageKey is string => Boolean(imageKey))
        .map((imageKey) => imageStore().remove(imageKey))
    );

    return json({ deleted: true });
  });
}
