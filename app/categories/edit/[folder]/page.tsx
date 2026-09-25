/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import BackLink from "@/app/components/BackLink";
import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import ImageEditor from "@/app/components/community/ImageEditor";
import ImagePicker from "@/app/components/community/ImagePicker";
import { CATEGORY_METADATA, type Category, type ImageExample } from "@/app/data";
import { primaryAnswer } from "@/app/categories/answers";
import { LIMITS } from "@/lib/community/config";
import { defaultQuery, type ImageResult } from "@/lib/community/search";

import {
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
 * Replace pictures in a built-in category.
 *
 * Replacements are stored in the database and layered over the shipped files,
 * so they survive deploys. Unlocked with the shared PIN, or by the admin.
 * "Przywróć" drops the replacement and the shipped file shows again.
 */
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
  const examples = useMemo(
    () =>
      ((meta?.examples ?? []) as Array<{ image?: string }>).filter(
        (example): example is ImageExample => typeof example.image === "string"
      ),
    [meta]
  );

  const [access, setAccess] = useState<CuratedAccess | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [working, setWorking] = useState(false);
  const [busy, setBusy] = useState<Record<string, string>>({});
  const [picking, setPicking] = useState<ImageExample | null>(null);
  const [editing, setEditing] = useState<ImageExample | null>(null);
  const [webSearchAvailable, setWebSearchAvailable] = useState(false);

  const load = useCallback(async () => {
    try {
      const [found, { overrides: all }] = await Promise.all([
        getCuratedAccess(),
        getCuratedOverrides(),
      ]);
      setAccess(found);
      setOverrides(all[folder] ?? {});
    } catch (caught) {
      setError(messageOf(caught, "Nie udało się wczytać."));
      setAccess({ isAdmin: false, isPinEditor: false, canEdit: false, hasPin: false });
    }
  }, [folder]);

  useEffect(() => {
    load();
    fetch("/api/community/capabilities")
      .then((response) => response.json())
      .then((found) => setWebSearchAvailable(Boolean(found.webImageSearch)))
      .catch(() => undefined);
  }, [load]);

  const srcOf = (example: ImageExample) =>
    overrides[example.image] ?? `/images/${folder}/${example.image}`;

  const run = async (
    example: ImageExample,
    label: string,
    action: () => Promise<unknown>
  ) => {
    setBusy((previous) => ({ ...previous, [example.image]: label }));
    setError("");
    try {
      await action();
      const { overrides: all } = await getCuratedOverrides();
      setOverrides(all[folder] ?? {});
    } catch (caught) {
      setError(`${primaryAnswer(example)}: ${messageOf(caught, "Nie udało się zapisać.")}`);
    } finally {
      setBusy((previous) => {
        const next = { ...previous };
        delete next[example.image];
        return next;
      });
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
              Obrazki „{meta.name}”
            </h1>
          </div>
          {error && <p className="text-red-300">{error}</p>}
          {access.hasPin ? (
            <form onSubmit={onUnlock} className="flex flex-col gap-4">
              <p className="text-white/70">
                Podmiana obrazków we wbudowanych kategoriach jest chroniona
                wspólnym PIN-em.
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
          <Link href="/community/admin" className="underline text-white/50 text-sm">
            Logowanie administratora
          </Link>
        </div>
      </FloorPageLayout>
    );
  }

  const replaced = examples.filter((example) => overrides[example.image]).length;

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
              Obrazki „{meta.name}”
            </h1>
            <p className="text-white/60 text-sm">
              Podmienione: {replaced} z {examples.length}
              {access.isAdmin ? " · jako admin" : " · odblokowane PIN-em"}
              {" · zmiany zapisują się od razu i przetrwają aktualizacje gry"}
            </p>
          </div>
          {access.isPinEditor && (
            <FloorButton variant="rectangular" className="text-sm font-semibold" onClick={onLock}>
              Zakończ edycję
            </FloorButton>
          )}
        </div>

        <p className="text-white/50 text-sm">
          <strong className="text-white/70">Szukaj</strong> podmienia obrazek na
          inny, <strong className="text-white/70">Edytuj</strong> przycina lub
          wymazuje jego fragment, a <strong className="text-white/70">Przywróć</strong>{" "}
          wraca do oryginału. Nazwy i kolejność przykładów się nie zmieniają.
        </p>

        {error && <p className="text-red-300">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {examples.map((example) => {
            const isReplaced = Boolean(overrides[example.image]);
            const status = busy[example.image];
            return (
              <div key={example.image} className="neon-panel p-2 flex flex-col gap-2">
                <div className="relative bg-gray-800 rounded-md overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={srcOf(example)}
                    alt={primaryAnswer(example)}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  {isReplaced && (
                    <span className="absolute top-1 left-1 text-[10px] font-bold uppercase bg-gold text-black px-1.5 py-0.5 rounded">
                      podmieniony
                    </span>
                  )}
                  {status && (
                    <span className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-sm">
                      {status}
                    </span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm text-center truncate" title={primaryAnswer(example)}>
                  {primaryAnswer(example)}
                </p>
                <div className="flex gap-1 justify-center flex-wrap">
                  <button
                    className="text-xs px-2 py-1 rounded border border-neon/60 text-neon disabled:opacity-40"
                    disabled={Boolean(status)}
                    onClick={() => setPicking(example)}
                  >
                    Szukaj
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded border border-neon/60 text-neon disabled:opacity-40"
                    disabled={Boolean(status)}
                    onClick={() => setEditing(example)}
                  >
                    Edytuj
                  </button>
                  {isReplaced && (
                    <button
                      className="text-xs px-2 py-1 rounded border border-white/40 text-white/80 disabled:opacity-40"
                      disabled={Boolean(status)}
                      onClick={() => {
                        if (!window.confirm(`Przywrócić oryginalny obrazek „${primaryAnswer(example)}”?`)) return;
                        run(example, "Przywracam…", () => revertCuratedImage(folder, example.image));
                      }}
                    >
                      Przywróć
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {picking && (
        <ImagePicker
          itemName={primaryAnswer(picking)}
          categoryName={meta.name}
          webSearchAvailable={webSearchAvailable}
          initialQuery={defaultQuery(primaryAnswer(picking), meta.name)}
          onPick={(result: ImageResult) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceFromResult(folder, example.image, result));
          }}
          onPickUrl={(url: string) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceFromUrl(folder, example.image, url));
          }}
          onPickFile={(file: File) => {
            const example = picking;
            setPicking(null);
            run(example, "Zapisuję…", () => replaceWithFile(folder, example.image, file));
          }}
          onClose={() => setPicking(null)}
        />
      )}

      {editing && (
        <ImageEditor
          src={srcOf(editing)}
          itemName={primaryAnswer(editing)}
          onSave={(blob) => {
            const example = editing;
            setEditing(null);
            return run(example, "Zapisuję…", () =>
              replaceWithFile(folder, example.image, blob, "Edited")
            );
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </FloorPageLayout>
  );
}
