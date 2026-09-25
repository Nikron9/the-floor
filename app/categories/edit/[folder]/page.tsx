/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import BackLink from "@/app/components/BackLink";
import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import ImageEditor from "@/app/components/curated/ImageEditor";
import ImagePicker from "@/app/components/curated/ImagePicker";
import { CATEGORY_METADATA, type Category } from "@/app/data";
import { curatedItems, isImageCategory, type CuratedItem } from "@/app/categories/examples";
import { LIMITS } from "@/lib/shared/config";
import { defaultQuery, type ImageResult } from "@/lib/shared/search";

import {
  editCuratedExample,
  getCuratedAccess,
  getCuratedOverrides,
  lockCurated,
  replaceFromResult,
  replaceFromUrl,
  replaceWithFile,
  revertCuratedImage,
  unlockCurated,
  type CuratedAccess,
} from "../../curatedApi";

const messageOf = (caught: unknown, fallback: string) =>
  caught instanceof Error ? caught.message : fallback;

/**
 * Edit a built-in category: add, change and delete its examples, and replace
 * pictures.
 *
 * Changes are stored in the database and layered over the shipped files, so
 * they survive deploys. Unlocked with the shared PIN, or by the admin.
 * "Przywróć" drops a change and the shipped version shows again.
 */

type FormState = {
  /** Undefined when adding a new example. */
  item?: CuratedItem;
  name: string;
  alternatives: string;
  text: string;
};

const splitAnswers = (value: string) =>
  value
    .split(/[\n,;]/)
    .map((part) => part.trim())
    .filter(Boolean);
export default function EditCuratedCategoryPage({
  params,
}: {
  params: Promise<{ folder: string }>;
}) {
  const { folder } = use(params);

  const category = useMemo(
    () =>
      (Object.keys(CATEGORY_METADATA) as Category[]).find(
        (key) => CATEGORY_METADATA[key].folder === folder
      ),
    [folder]
  );
  const meta = category ? CATEGORY_METADATA[category] : undefined;
  const imageCategory = category ? isImageCategory(category) : false;

  const [access, setAccess] = useState<CuratedAccess | null>(null);
  const [allOverrides, setAllOverrides] = useState<Record<string, Record<string, string>>>({});
  const overrides = allOverrides[folder] ?? {};
  const items = useMemo(
    () => (category ? curatedItems(category, allOverrides, { includeDeleted: true }) : []),
    [category, allOverrides]
  );
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [working, setWorking] = useState(false);
  const [busy, setBusy] = useState<Record<string, string>>({});
  const [picking, setPicking] = useState<CuratedItem | null>(null);
  const [editing, setEditing] = useState<CuratedItem | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [webSearchAvailable, setWebSearchAvailable] = useState(false);

  const load = useCallback(async () => {
    try {
      const [found, { overrides: all }] = await Promise.all([
        getCuratedAccess(),
        getCuratedOverrides(),
      ]);
      setAccess(found);
      setAllOverrides(all);
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się wczytać."));
      setAccess({ isAdmin: false, isPinEditor: false, canEdit: false, hasPin: false });
    }
  }, [folder]);

  useEffect(() => {
    load();
    fetch("/api/capabilities")
      .then((response) => response.json())
      .then((found) => setWebSearchAvailable(Boolean(found.webImageSearch)))
      .catch(() => undefined);
  }, [load]);

  const refresh = async () => {
    const { overrides: all } = await getCuratedOverrides();
    setAllOverrides(all);
    return all;
  };

  const run = async (item: CuratedItem, label: string, action: () => Promise<unknown>) => {
    setBusy((previous) => ({ ...previous, [item.key]: label }));
    setError("");
    try {
      await action();
      await refresh();
    } catch (caught) {
      setError(`${item.name}: ${messageOf(caught, "Nie udało się zapisać.")}`);
    } finally {
      setBusy((previous) => {
        const next = { ...previous };
        delete next[item.key];
        return next;
      });
    }
  };

  const openAdd = () => setForm({ name: "", alternatives: "", text: "" });
  const openEdit = (item: CuratedItem) =>
    setForm({
      item,
      name: item.name,
      alternatives: item.alternatives.join("\n"),
      text: item.text ?? "",
    });

  const onSaveForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const result = await editCuratedExample({
        folder,
        action: form.item ? "edit" : "add",
        key: form.item?.key,
        name: form.name,
        alternatives: splitAnswers(form.alternatives),
        text: form.text,
      });
      await refresh();
      const added = !form.item && result.edit?.key;
      setForm(null);
      // A new picture example needs a picture before it can appear in a round.
      if (added && imageCategory) {
        setPicking({
          key: result.edit!.key,
          name: form.name.trim(),
          alternatives: [],
          image: result.edit!.key,
          status: "added",
        });
      }
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się zapisać."));
    } finally {
      setSaving(false);
    }
  };

  const onUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorking(true);
    setPinError("");
    try {
      await unlockCurated(pin);
      setPin("");
      await load();
    } catch (caught) {
      setPinError(messageOf(caught, "Nie udało się odblokować."));
    } finally {
      setWorking(false);
    }
  };

  const onLock = async () => {
    await lockCurated().catch(() => undefined);
    await load();
  };

  if (!meta) {
    return (
      <FloorPageLayout>
        <div className="p-20 text-center flex flex-col gap-4">
          <p className="text-red-300">Nie ma takiej kategorii.</p>
          <Link href="/categories" className="underline text-neon">
            Wróć do kategorii
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  if (!access) {
    return (
      <FloorPageLayout>
        <p className="text-white/60 p-20 text-center">Ładowanie…</p>
      </FloorPageLayout>
    );
  }

  if (!access.canEdit) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-16 max-w-md mx-auto flex flex-col gap-6">
          <div>
            <BackLink href="/categories">Kategorie</BackLink>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "var(--color-neon)" }}
            >
              Edycja „{meta.name}”
            </h1>
          </div>
          {error && <p className="text-red-300">{error}</p>}
          {access.hasPin ? (
            <form onSubmit={onUnlock} className="flex flex-col gap-4">
              <p className="text-white/70">
                Edycja wbudowanych kategorii jest chroniona wspólnym PIN-em.
              </p>
              <label className="flex flex-col gap-2">
                <span className="font-semibold" style={{ color: "var(--color-neon)" }}>
                  PIN
                </span>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="\d*"
                  maxLength={LIMITS.editPinMaxLength}
                  value={pin}
                  onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                  autoFocus
                  className="bg-gray-800 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon tracking-[0.5em] text-center text-2xl"
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
          ) : (
            <p className="text-yellow-200">
              PIN do edycji wbudowanych kategorii nie jest jeszcze ustawiony.
              Administrator ustawia go w panelu administratora.
            </p>
          )}
          <Link href="/admin" className="underline text-white/50 text-sm">
            Logowanie administratora
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  const changed = items.filter((item) => item.status !== "shipped").length;
  const visible = items.filter((item) => item.status !== "deleted").length;

  return (
    <FloorPageLayout>
      <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BackLink href="/categories">Kategorie</BackLink>
            <h1
              className="text-3xl font-bold glow-text mt-2"
              style={{ color: "var(--color-neon)" }}
            >
              Edycja „{meta.name}”
            </h1>
            <p className="text-white/60 text-sm">
              Elementów: {visible} · zmienionych: {changed}
              {access.isAdmin ? " · jako admin" : " · odblokowane PIN-em"}
              {" · zmiany zapisują się od razu i przetrwają aktualizacje gry"}
            </p>
          </div>
          <div className="flex gap-2">
            <FloorButton variant="rectangular" className="btn-primary text-sm font-semibold" onClick={openAdd}>
              Dodaj element
            </FloorButton>
            {access.isPinEditor && (
              <FloorButton variant="rectangular" className="text-sm font-semibold" onClick={onLock}>
                Zakończ edycję
              </FloorButton>
            )}
          </div>
        </div>

        <p className="text-white/50 text-sm">
          <strong className="text-white/70">Odpowiedzi</strong> zmienia nazwę i
          akceptowane odpowiedzi, <strong className="text-white/70">Usuń</strong>{" "}
          zdejmuje element z gry
          {imageCategory && (
            <>
              , <strong className="text-white/70">Obrazek</strong> podmienia
              zdjęcie, a <strong className="text-white/70">Kadruj</strong> przycina
              je lub wymazuje fragment
            </>
          )}
          . Nowe elementy trafiają na koniec kategorii (są najtrudniejsze).
        </p>

        {error && <p className="text-red-300">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const status = busy[item.key];
            const deleted = item.status === "deleted";
            const pictureReplaced = Boolean(item.image && overrides[item.image]);
            const badge =
              item.status === "added"
                ? "dodany"
                : item.status === "edited"
                  ? "zmieniony"
                  : deleted
                    ? "usunięty"
                    : pictureReplaced
                      ? "nowy obrazek"
                      : "";
            return (
              <div
                key={item.key}
                className={`neon-panel p-2 flex flex-col gap-2 ${deleted ? "opacity-50" : ""}`}
              >
                <div className="relative bg-gray-800 rounded-md overflow-hidden aspect-square flex items-center justify-center p-2">
                  {item.text !== undefined ? (
                    <span className="text-white text-xl font-bold text-center break-words">
                      {item.text}
                    </span>
                  ) : item.src ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-white/50 text-sm text-center">
                      Brak obrazka — element nie pojawi się w grze
                    </span>
                  )}
                  {badge && (
                    <span className="absolute top-1 left-1 text-[10px] font-bold uppercase bg-gold text-black px-1.5 py-0.5 rounded">
                      {badge}
                    </span>
                  )}
                  {status && (
                    <span className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-sm">
                      {status}
                    </span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm text-center truncate" title={item.name}>
                  {item.name}
                </p>
                {item.alternatives.length > 0 && (
                  <p className="text-white/50 text-xs text-center truncate" title={item.alternatives.join(", ")}>
                    także: {item.alternatives.join(", ")}
                  </p>
                )}
                <div className="flex gap-1 justify-center flex-wrap">
                  {deleted ? (
                    <button
                      className="text-xs px-2 py-1 rounded border border-white/40 text-white/80 disabled:opacity-40"
                      disabled={Boolean(status)}
                      onClick={() =>
                        run(item, "Przywracam…", () =>
                          editCuratedExample({ folder, action: "restore", key: item.key })
                        )
                      }
                    >
                      Przywróć element
                    </button>
                  ) : (
                    <>
                      <button
                        className="text-xs px-2 py-1 rounded border border-neon/60 text-neon disabled:opacity-40"
                        disabled={Boolean(status)}
                        onClick={() => openEdit(item)}
                      >
                        Odpowiedzi
                      </button>
                      {item.image && (
                        <button
                          className="text-xs px-2 py-1 rounded border border-neon/60 text-neon disabled:opacity-40"
                          disabled={Boolean(status)}
                          onClick={() => setPicking(item)}
                        >
                          Obrazek
                        </button>
                      )}
                      {item.src && (
                        <button
                          className="text-xs px-2 py-1 rounded border border-neon/60 text-neon disabled:opacity-40"
                          disabled={Boolean(status)}
                          onClick={() => setEditing(item)}
                        >
                          Kadruj
                        </button>
                      )}
                      {pictureReplaced && item.status !== "added" && (
                        <button
                          className="text-xs px-2 py-1 rounded border border-white/40 text-white/80 disabled:opacity-40"
                          disabled={Boolean(status)}
                          onClick={() => {
                            if (!window.confirm(`Przywrócić oryginalny obrazek „${item.name}”?`)) return;
                            run(item, "Przywracam…", () => revertCuratedImage(folder, item.image!));
                          }}
                        >
                          Oryginalny obrazek
                        </button>
                      )}
                      {item.status === "edited" && (
                        <button
                          className="text-xs px-2 py-1 rounded border border-white/40 text-white/80 disabled:opacity-40"
                          disabled={Boolean(status)}
                          onClick={() =>
                            run(item, "Przywracam…", () =>
                              editCuratedExample({ folder, action: "restore", key: item.key })
                            )
                          }
                        >
                          Cofnij zmiany
                        </button>
                      )}
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-400/60 text-red-300 disabled:opacity-40"
                        disabled={Boolean(status)}
                        onClick={() => {
                          const question =
                            item.status === "added"
                              ? `Usunąć na stałe dodany element „${item.name}”?`
                              : `Usunąć „${item.name}” z gry? Można go potem przywrócić.`;
                          if (!window.confirm(question)) return;
                          run(item, "Usuwam…", () =>
                            editCuratedExample({ folder, action: "delete", key: item.key })
                          );
                        }}
                      >
                        Usuń
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {form && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={onSaveForm}
            className="neon-panel w-full max-w-lg p-6 flex flex-col gap-4 bg-black"
          >
            <h2 className="text-2xl font-bold text-white">
              {form.item ? `Edytuj „${form.item.name}”` : "Nowy element"}
            </h2>
            {!imageCategory && (
              <label className="flex flex-col gap-1 text-sm text-white/80">
                Treść na ekranie
                <input
                  value={form.text}
                  onChange={(event) => setForm({ ...form, text: event.target.value })}
                  className="bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none"
                  required
                  autoFocus
                />
              </label>
            )}
            <label className="flex flex-col gap-1 text-sm text-white/80">
              Odpowiedź (pokazywana na rzutniku)
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none"
                required
                autoFocus={imageCategory}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-white/80">
              Inne akceptowane odpowiedzi (każda w nowej linii albo po przecinku)
              <textarea
                value={form.alternatives}
                onChange={(event) => setForm({ ...form, alternatives: event.target.value })}
                rows={4}
                className="bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none"
              />
            </label>
            {!form.item && imageCategory && (
              <p className="text-xs text-white/50">
                Po zapisaniu od razu wybierzesz obrazek dla nowego elementu.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <FloorButton type="button" variant="rectangular" className="text-sm" onClick={() => setForm(null)}>
                Anuluj
              </FloorButton>
              <FloorButton
                type="submit"
                variant="rectangular"
                className="btn-primary text-sm font-semibold"
                disabled={saving || !form.name.trim() || (!imageCategory && !form.text.trim())}
              >
                {saving ? "Zapisuję…" : "Zapisz"}
              </FloorButton>
            </div>
          </form>
        </div>
      )}

      {picking && (
        <ImagePicker
          itemName={picking.name}
          categoryName={meta.name}
          webSearchAvailable={webSearchAvailable}
          initialQuery={defaultQuery(picking.name, meta.name)}
          onPick={(result: ImageResult) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceFromResult(folder, example.image!, result));
          }}
          onPickUrl={(url: string) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceFromUrl(folder, example.image!, url));
          }}
          onPickFile={(file: File) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceWithFile(folder, example.image!, file));
          }}
          onClose={() => setPicking(null)}
        />
      )}

      {editing && (
        <ImageEditor
          src={editing.src ?? ""}
          itemName={editing.name}
          onSave={(blob) => {
            const example = editing;
            setEditing(null);
            return run(example, "Zapisuję…", () =>
              replaceWithFile(folder, example.image!, blob, "Edited")
            );
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </FloorPageLayout>
  );
}
