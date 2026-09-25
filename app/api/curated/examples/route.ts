import { randomBytes } from "node:crypto";

import { fail, handle, json, readJson } from "@/lib/shared/http";
import { cleanText } from "@/lib/shared/validate";
import { imageStore } from "@/lib/shared/storage";
import { curatedAccess } from "@/lib/curated/access";
import { curatedFolders } from "@/lib/curated/catalog";
import { shippedExampleKeys } from "@/lib/curated/editable";
import { curatedRepo } from "@/lib/curated/overrides";
import { isImageCategory, type ExampleEdit } from "@/app/categories/examples";

/**
 * Add, edit, delete or restore an example of a built-in category.
 *
 * Body: `{ folder, action: "add" | "edit" | "delete" | "restore", key?,
 * name?, alternatives?, text? }`. Edits are stored in the database and layered
 * over the shipped list, so they survive deploys; "restore" drops the edit of
 * a shipped example. Deleting an added example removes it (and its picture)
 * for good.
 */

const MAX_ANSWERS = 12;
const MAX_LENGTH = 120;

const lower = (value: string) => value.toLocaleLowerCase("pl");

const answersFrom = (body: Record<string, unknown>) => {
  const name = cleanText(body.name).slice(0, MAX_LENGTH);
  const seen = new Set([lower(name)]);
  const alternatives: string[] = [];
  for (const raw of Array.isArray(body.alternatives) ? body.alternatives : []) {
    const value = cleanText(raw).slice(0, MAX_LENGTH);
    if (!value || seen.has(lower(value))) continue;
    seen.add(lower(value));
    alternatives.push(value);
  }
  return { name, alternatives: alternatives.slice(0, MAX_ANSWERS) };
};

export async function POST(request: Request) {
  return handle(async () => {
    if (!(await curatedAccess()).canEdit) {
      return fail("Aby edytować kategorie, odblokuj edycję PIN-em.", 403);
    }

    const body = await readJson(request);
    const folder = cleanText(body.folder);
    const category = curatedFolders().get(folder);
    if (!category) return fail("Nie ma takiej kategorii.", 404);

    const action = cleanText(body.action);
    const key = cleanText(body.key);
    const repo = curatedRepo();
    const imageCategory = isImageCategory(category);
    const text = cleanText(body.text).slice(0, MAX_LENGTH);

    if (action === "add") {
      const { name, alternatives } = answersFrom(body);
      if (!name) return fail("Podaj odpowiedź.");
      if (!imageCategory && !text) return fail("Podaj treść, która pojawi się na ekranie.");
      const newKey = `added-${randomBytes(4).toString("hex")}${imageCategory ? ".jpg" : ""}`;
      const edit: ExampleEdit = {
        kind: "add",
        name,
        alternatives,
        ...(imageCategory ? {} : { text }),
        order: Date.now(),
      };
      return json({ edit: await repo.upsertEdit(folder, newKey, edit) });
    }

    const shipped = shippedExampleKeys(folder)?.has(key) ?? false;
    const existing = await repo.getEdit(folder, key);
    const isAdded = existing?.edit.kind === "add";
    if (!shipped && !isAdded) return fail("Nie ma takiego elementu w tej kategorii.", 404);

    if (action === "edit") {
      const { name, alternatives } = answersFrom(body);
      if (!name) return fail("Podaj odpowiedź.");
      if (!imageCategory && !text) return fail("Podaj treść, która pojawi się na ekranie.");
      const edit: ExampleEdit = isAdded
        ? { ...existing!.edit, name, alternatives, ...(imageCategory ? {} : { text }) }
        : { kind: "edit", name, alternatives, ...(imageCategory ? {} : { text }) };
      return json({ edit: await repo.upsertEdit(folder, key, edit) });
    }

    if (action === "delete") {
      if (isAdded) {
        await repo.removeEdit(folder, key);
        const picture = await repo.get(folder, key);
        if (picture) {
          await repo.remove(folder, key);
          if (picture.imageKey) await imageStore().remove(picture.imageKey);
        }
        return json({ removed: true });
      }
      return json({ edit: await repo.upsertEdit(folder, key, { kind: "delete" }) });
    }

    if (action === "restore") {
      if (!shipped) return fail("Tylko wbudowane elementy można przywrócić.");
      await repo.removeEdit(folder, key);
      return json({ restored: true });
    }

    return fail("Nieznana akcja.");
  });
}
