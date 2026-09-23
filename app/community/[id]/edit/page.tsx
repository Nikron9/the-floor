"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

import BackLink from "@/app/components/BackLink";
import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import ImageEditor from "@/app/components/community/ImageEditor";
import ImagePicker from "@/app/components/community/ImagePicker";
import ItemCell, { type CellStatus } from "@/app/components/community/ItemCell";
import { useCommunityCategories } from "@/app/categories/useCommunityCategories";
import { LIMITS } from "@/lib/community/config";
import { defaultQuery, type ImageResult } from "@/lib/community/search";
import type { CommunityCategoryView } from "@/lib/community/types";

import {
  ApiError,
  attachImageFile,
  attachImageFromResult,
  attachImageFromUrl,
  changePin,
  deleteCategory,
  getCategory,
  lockEditing,
  publishCategory,
  saveItems,
  setCategoryHidden,
  unlockWithPin,
} from "../../api";

type CellState = { status: CellStatus; message?: string };
type Item = CommunityCategoryView["items"][number];

const inputClass =
  "bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]";

const messageOf = (caught: unknown, fallback: string) =>
  caught instanceof Error ? caught.message : fallback;

/** What the server needs to keep an item: its id, name and alternatives. */
const toInput = (item: Pick<Item, "id" | "name" | "alternatives">) => ({
  id: item.id,
  name: item.name,
  alternatives: item.alternatives,
});

/**
 * Change a category that's already saved.
 *
 * The create page is built around filling fifty empty squares as fast as
 * possible. This is the opposite job: the category exists and something in
 * it needs changing -- a wrong picture, a missing item, a typo. So there's no
 * auto-fill; just add an item, rename one, and the same Find / Edit / Remove
 * per square, for whoever is allowed to touch it: the author, the admin (see
 * `lib/community/admin.ts`), or anyone who has the category's PIN.
 *
 * Changes save as they're made. Replacing a picture deletes the old object
 * from storage as part of the same request, so the offending image is gone,
 * not merely unlinked.
 */
export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [category, setCategory] = useState<CommunityCategoryView | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  /** HTTP status of a failed load: 403/404/410 may just mean "locked". */
  const [loadStatus, setLoadStatus] = useState(0);
  const [error, setError] = useState("");
  const [cells, setCells] = useState<Record<string, CellState>>({});
  const [picking, setPicking] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinNotice, setPinNotice] = useState("");

  const [webSearchAvailable, setWebSearchAvailable] = useState(false);

  const { removeCategory } = useCommunityCategories();

  const load = useCallback(async () => {
    try {
      const { category: found } = await getCategory(id);
      setCategory(found);
      setStatus("ready");
    } catch (caught) {
      setCategory(null);
      setLoadStatus(caught instanceof ApiError ? caught.status : 0);
      setError(messageOf(caught, "Nie udało się wczytać."));
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    load();

    fetch("/api/community/capabilities")
      .then((response) => response.json())
      .then((found) => {
        if (!cancelled) setWebSearchAvailable(Boolean(found.webImageSearch));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [load]);

  const patchCell = (itemId: string, patch: CellState) =>
    setCells((previous) => ({ ...previous, [itemId]: patch }));

  const replaceItem = (item: Item) =>
    setCategory((previous) =>
      previous
        ? {
            ...previous,
            items: previous.items.map((candidate) =>
              candidate.id === item.id ? item : candidate
            ),
          }
        : previous
    );

  /* ------------------------------------------------------------ unlocking */

  const onUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    setPinError("");
    try {
      await unlockWithPin(id, pin);
      setPin("");
      setError("");
      await load();
    } catch (caught) {
      setPinError(messageOf(caught, "Nie udało się odblokować."));
    } finally {
      setWorking(false);
    }
  };

  const onLock = async () => {
    setWorking(true);
    try {
      await lockEditing(id);
      router.push(`/community/${id}`);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się zablokować."));
      setWorking(false);
    }
  };

  /* --------------------------------------------------------------- images */

  /** Every way of attaching a picture ends up here. */
  const attach = async (
    itemId: string,
    upload: () => Promise<{ item: Item }>
  ) => {
    patchCell(itemId, { status: "uploading" });
    try {
      const { item } = await upload();
      replaceItem(item);
      patchCell(itemId, { status: "ready" });
    } catch (caught) {
      patchCell(itemId, {
        status: "error",
        message: messageOf(caught, "Nie udało się zapisać."),
      });
    }
  };

  const onPickResult = (itemId: string, result: ImageResult) => {
    setPicking(null);
    return attach(itemId, () => attachImageFromResult(id, itemId, result));
  };

  const onPickUrl = (itemId: string, url: string) => {
    setPicking(null);
    return attach(itemId, () => attachImageFromUrl(id, itemId, url));
  };

  const onPickFile = (itemId: string, file: File) => {
    setPicking(null);
    return attach(itemId, () => attachImageFile(id, itemId, file));
  };

  const onSaveEdit = async (itemId: string, blob: Blob) => {
    setEditing(null);
    return attach(itemId, () => attachImageFile(id, itemId, blob, "Edited"));
  };

  /* ---------------------------------------------------------------- items */

  const isTaken = (name: string, exceptId?: string) =>
    category?.items.some(
      (item) =>
        item.id !== exceptId && item.name.toLowerCase() === name.toLowerCase()
    ) ?? false;

  /** Add an item, then go straight to picking its picture. */
  const onAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!category) return;

    const name = newItemName.trim();
    if (!name) return;
    if (isTaken(name)) {
      setError(`Element „${name}” już jest w tej kategorii.`);
      return;
    }

    setWorking(true);
    setError("");
    try {
      const known = new Set(category.items.map((item) => item.id));
      const { category: saved } = await saveItems(id, [
        ...category.items.map(toInput),
        { name, alternatives: [] },
      ]);
      setCategory(saved);
      setNewItemName("");

      const added = saved.items.find((item) => !known.has(item.id));
      if (added) setPicking(added.id);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się dodać."));
    } finally {
      setWorking(false);
    }
  };

  const onRename = async (
    itemId: string,
    name: string,
    alternatives: string[]
  ) => {
    if (!category) return;
    if (isTaken(name, itemId)) {
      const message = `Element „${name}” już jest w tej kategorii.`;
      setError(message);
      throw new Error(message);
    }

    setError("");
    try {
      const { category: saved } = await saveItems(
        id,
        category.items.map((item) =>
          item.id === itemId ? { id: item.id, name, alternatives } : toInput(item)
        )
      );
      setCategory(saved);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się zmienić nazwy."));
      throw caught;
    }
  };

  /** Drop the item entirely. The server deletes its image as an orphan. */
  const onRemove = async (itemId: string) => {
    if (!category) return;
    const item = category.items.find((candidate) => candidate.id === itemId);
    if (!item) return;
    if (!window.confirm(`Usunąć „${item.name}” z tej kategorii?`)) return;

    const remaining = category.items.filter((candidate) => candidate.id !== itemId);

    // Optimistic: the square disappears now, and the save either agrees or
    // puts it back with an error.
    setCategory({ ...category, items: remaining });
    setError("");

    try {
      const { category: saved } = await saveItems(id, remaining.map(toInput));
      setCategory(saved);
    } catch (caught) {
      setCategory(category);
      setError(messageOf(caught, "Nie udało się usunąć."));
    }
  };

  /* ------------------------------------------------------------- category */

  const onPublish = async () => {
    setWorking(true);
    setError("");
    try {
      const { category: published } = await publishCategory(id);
      setCategory(published);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się opublikować."));
    } finally {
      setWorking(false);
    }
  };

  const onChangePin = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    setPinNotice("");
    try {
      const { category: saved } = await changePin(id, newPin);
      setCategory(saved);
      setNewPin("");
      setPinNotice("Zapisano nowy PIN. Stary przestał działać.");
    } catch (caught) {
      setPinNotice(messageOf(caught, "Nie udało się zmienić PIN-u."));
    } finally {
      setWorking(false);
    }
  };

  const onToggleHidden = async () => {
    if (!category) return;
    setWorking(true);
    setError("");
    try {
      const { category: next } = await setCategoryHidden(id, !category.hiddenAt);
      setCategory(next);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się tego zrobić."));
    } finally {
      setWorking(false);
    }
  };

  const onDelete = async () => {
    if (!category) return;
    if (!window.confirm(`Usunąć „${category.name}” wraz ze wszystkimi obrazkami? Tej operacji nie można cofnąć.`)) {
      return;
    }
    setWorking(true);
    setError("");
    try {
      await deleteCategory(id);
      removeCategory(id);
      router.push(category.isAdmin ? "/community/admin" : "/community");
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się usunąć."));
      setWorking(false);
    }
  };

  /* ----------------------------------------------------------------- views */

  if (status === "loading") {
    return (
      <FloorPageLayout>
        <p className="text-white/60 p-20 text-center">Ładowanie…</p>
      </FloorPageLayout>
    );
  }

  // A draft or hidden category answers 404/410 to anyone who can't edit it
  // yet -- which is exactly who the PIN is for -- so those get the PIN form
  // too. Anything else is a real failure.
  const locked =
    (status === "ready" && category && !category.canEdit) ||
    (status === "error" && [403, 404, 410].includes(loadStatus));

  if (status === "error" && !locked) {
    return (
      <FloorPageLayout>
        <div className="p-20 text-center flex flex-col gap-4">
          <p className="text-red-300">{error}</p>
          <Link href="/community" className="underline text-[#00d4ff]">
            Wróć do puli
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  if (locked || !category) {
    const noPin = category && !category.hasEditPin;

    return (
      <FloorPageLayout>
        <div className="p-8 md:p-16 max-w-md mx-auto flex flex-col gap-6">
          <div>
            <BackLink href={category ? `/community/${id}` : "/community"}>
              {category ? "Wróć do kategorii" : "Kategorie społeczności"}
            </BackLink>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "#00d4ff" }}
            >
              {category ? `Edycja „${category.name}”` : "Edycja kategorii"}
            </h1>
          </div>

          {noPin ? (
            <p className="text-yellow-200">
              Ta kategoria powstała, zanim można było ustawić PIN, więc edytować
              ją może tylko jej autor (w przeglądarce, w której ją utworzył) lub
              administrator.
            </p>
          ) : (
            <form onSubmit={onUnlock} className="flex flex-col gap-4">
              <p className="text-white/70">
                Aby nikt obcy nie mógł jej zepsuć, edycja jest chroniona PIN-em
                ustawionym przy tworzeniu kategorii.
              </p>
              <label className="flex flex-col gap-2">
                <span className="font-semibold" style={{ color: "#00d4ff" }}>
                  PIN
                </span>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="\d*"
                  maxLength={LIMITS.editPinMaxLength}
                  value={pin}
                  onChange={(event) =>
                    setPin(event.target.value.replace(/\D/g, ""))
                  }
                  autoFocus
                  className={`${inputClass} tracking-[0.5em] text-center text-2xl`}
                />
              </label>
              {pinError && <p className="text-red-300">{pinError}</p>}
              <FloorButton
                type="submit"
                variant="rectangular"
                className="font-semibold"
                disabled={working || pin.length < LIMITS.editPinMinLength}
              >
                {working ? "Sprawdzam…" : "Odblokuj edycję"}
              </FloorButton>
            </form>
          )}

          <Link href="/community/admin" className="underline text-white/50 text-sm">
            Logowanie administratora
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  const withImages = category.items.filter((item) => item.imageUrl).length;
  const pickingItem = category.items.find((item) => item.id === picking);
  const editingItem = category.items.find((item) => item.id === editing);
  const full = category.items.length >= LIMITS.maxItemsPerCategory;
  const viaPinOnly = category.isPinEditor && !category.canManage;

  return (
    <FloorPageLayout>
      <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BackLink href={`/community/${id}`}>Wróć do kategorii</BackLink>
            <h1
              className="text-3xl font-bold glow-text mt-2"
              style={{ color: "#00d4ff" }}
            >
              Edycja „{category.name}”
            </h1>
            <p className="text-white/60 text-sm">
              Z obrazkiem: {withImages} z {category.items.length}
              {category.status === "draft" ? " · szkic" : " · opublikowana"}
              {category.hiddenAt ? " · ukryta na listach" : ""}
              {category.isAdmin ? " · jako admin" : ""}
              {viaPinOnly ? " · odblokowana PIN-em" : ""}
              {" · zmiany zapisują się od razu"}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {category.status === "draft" &&
              (category.isOwner || category.isPinEditor) && (
                <FloorButton
                  variant="rectangular"
                  className="text-sm font-semibold"
                  disabled={working || withImages < LIMITS.minItemsToPublish}
                  onClick={onPublish}
                >
                  Opublikuj
                </FloorButton>
              )}
            {category.isAdmin && (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={working}
                onClick={onToggleHidden}
              >
                {category.hiddenAt ? "Przywróć" : "Ukryj"}
              </FloorButton>
            )}
            {category.isPinEditor && (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={working}
                onClick={onLock}
              >
                Zakończ edycję
              </FloorButton>
            )}
            {category.canManage && (
              <FloorButton
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={working}
                onClick={onDelete}
              >
                Usuń kategorię
              </FloorButton>
            )}
          </div>
        </div>

        <form
          onSubmit={onAddItem}
          className="flex flex-col sm:flex-row gap-2 bg-gray-900/60 border border-[#00d4ff]/40 rounded-lg p-3"
        >
          <input
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
            maxLength={LIMITS.maxItemNameLength}
            placeholder={full ? "Kategoria jest pełna" : "Nowy element, np. Zapiekanka"}
            aria-label="Nazwa nowego elementu"
            disabled={full}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md border border-[#00d4ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] disabled:opacity-50"
          />
          <FloorButton
            type="submit"
            variant="rectangular"
            className="text-sm font-semibold"
            disabled={working || full || !newItemName.trim()}
          >
            Dodaj i wybierz obrazek
          </FloorButton>
        </form>

        <p className="text-white/50 text-sm">
          Kliknij nazwę (<strong className="text-white/70">✎</strong>), aby ją
          poprawić. <strong className="text-white/70">Szukaj</strong> podmienia
          obrazek na inny, <strong className="text-white/70">Edytuj</strong>{" "}
          przycina lub wymazuje jego fragment, a{" "}
          <strong className="text-white/70">×</strong> usuwa element. Elementy
          bez obrazka są pomijane w grze. Zastąpiony obrazek jest usuwany z
          magazynu, a nie tylko odłączany. Gry, które już dodały tę kategorię,
          zachowują własną kopię, dopóki nie zostanie dodana ponownie.
        </p>

        {error && <p className="text-red-300">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {category.items.map((item) => {
            const cell = cells[item.id] ?? { status: "ready" as CellStatus };
            return (
              <ItemCell
                key={item.id}
                item={item}
                status={cell.status}
                message={cell.message}
                onSearch={() => setPicking(item.id)}
                onEdit={() => setEditing(item.id)}
                onRemove={() => onRemove(item.id)}
                onRename={(name, alternatives) =>
                  onRename(item.id, name, alternatives)
                }
              />
            );
          })}
        </div>

        {category.canManage && (
          <form
            onSubmit={onChangePin}
            className="border-t border-white/10 pt-6 flex flex-col gap-3 max-w-md"
          >
            <h2 className="text-lg font-bold" style={{ color: "#00d4ff" }}>
              PIN do edycji
            </h2>
            <p className="text-white/60 text-sm">
              {category.hasEditPin
                ? "Każdy, kto zna PIN, może edytować elementy tej kategorii (ale nie może jej usunąć). Nowy PIN od razu odbiera dostęp wszystkim, którzy znali stary."
                : "Ta kategoria nie ma jeszcze PIN-u, więc edytować ją możesz tylko ty. Ustaw go, aby edytować z innego urządzenia albo z kimś."}
            </p>
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                autoComplete="off"
                pattern="\d*"
                maxLength={LIMITS.editPinMaxLength}
                value={newPin}
                onChange={(event) =>
                  setNewPin(event.target.value.replace(/\D/g, ""))
                }
                placeholder={`${LIMITS.editPinMinLength}–${LIMITS.editPinMaxLength} cyfr`}
                aria-label="Nowy PIN"
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md border border-[#00d4ff]/60 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] tracking-widest"
              />
              <FloorButton
                type="submit"
                variant="rectangular"
                className="text-sm font-semibold"
                disabled={working || newPin.length < LIMITS.editPinMinLength}
              >
                {category.hasEditPin ? "Zmień PIN" : "Ustaw PIN"}
              </FloorButton>
            </div>
            {pinNotice && <p className="text-yellow-200 text-sm">{pinNotice}</p>}
          </form>
        )}
      </div>

      {picking && pickingItem && (
        <ImagePicker
          itemName={pickingItem.name}
          categoryName={category.name}
          webSearchAvailable={webSearchAvailable}
          initialQuery={defaultQuery(pickingItem.name, category.name)}
          onPick={(result) => onPickResult(picking, result)}
          onPickUrl={(url) => onPickUrl(picking, url)}
          onPickFile={(file) => onPickFile(picking, file)}
          onClose={() => setPicking(null)}
        />
      )}

      {editing && editingItem?.imageUrl && (
        <ImageEditor
          src={editingItem.imageUrl}
          itemName={editingItem.name}
          onSave={(blob) => onSaveEdit(editing, blob)}
          onClose={() => setEditing(null)}
        />
      )}
    </FloorPageLayout>
  );
}
