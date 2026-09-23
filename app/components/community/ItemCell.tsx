/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

import { LIMITS } from "@/lib/community/config";
import type { CommunityItem } from "@/lib/community/types";

export type CellStatus =
  | "waiting"
  | "searching"
  | "uploading"
  | "ready"
  | "empty"
  | "error";

/**
 * One square of the grid: the item, its picture, and what to do about it.
 *
 * `onShuffle` only exists while building, where there are search results to
 * step through; `onRename` only on a saved category, where the name is no
 * longer a line in a textarea.
 */
export default function ItemCell({
  item,
  status,
  message,
  canShuffle = false,
  onShuffle,
  onSearch,
  onEdit,
  onRemove,
  onRename,
}: {
  item: CommunityItem;
  status: CellStatus;
  message?: string;
  canShuffle?: boolean;
  onShuffle?: () => void;
  onSearch: () => void;
  onEdit: () => void;
  onRemove: () => void;
  /** Resolves when saved; rejecting keeps the form open to fix. */
  onRename?: (name: string, alternatives: string[]) => Promise<void>;
}) {
  const busy = status === "searching" || status === "uploading";

  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [draftAlternatives, setDraftAlternatives] = useState("");
  const [savingName, setSavingName] = useState(false);

  const startRename = () => {
    setDraftName(item.name);
    setDraftAlternatives(item.alternatives.join(", "));
    setRenaming(true);
  };

  const submitRename = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onRename || !draftName.trim()) return;

    setSavingName(true);
    try {
      await onRename(
        draftName.trim(),
        draftAlternatives
          .split(",")
          .map((alternative) => alternative.trim())
          .filter(Boolean)
      );
      setRenaming(false);
    } catch {
      // The page shows why; the form stays open so it can be fixed.
    } finally {
      setSavingName(false);
    }
  };

  /**
   * Retry a freshly-uploaded image that isn't being served yet.
   *
   * Objects go into R2 over the S3 API, but the public URL is a separate edge
   * that can still 404 for a moment afterwards -- so the grid would show a
   * broken image immediately after an edit and stay broken until a reload. The
   * cache-buster matters: without it the retry just re-reads the cached 404.
   */
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAttempt(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.imageUrl]);

  const onImageError = () => {
    if (attempt >= 3) return;
    timerRef.current = setTimeout(
      () => setAttempt((previous) => previous + 1),
      600 * (attempt + 1)
    );
  };

  const src =
    item.imageUrl && attempt > 0
      ? `${item.imageUrl}${item.imageUrl.includes("?") ? "&" : "?"}retry=${attempt}`
      : item.imageUrl;

  return (
    <div className="bg-gray-900/60 border border-[#00d4ff]/40 rounded-lg overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-black flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            onError={onImageError}
            // Must match the editor, which loads the same URL with
            // crossOrigin="anonymous". The browser caches the CORS mode
            // alongside the response, so a plain load here poisons the cache
            // for the editor: it gets the cached non-CORS copy back and can't
            // read the pixels, and "Edit" fails on every image that has
            // already been displayed.
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-white/30 text-sm px-2 text-center">
            {status === "error" ? "Brak obrazka" : "—"}
          </span>
        )}

        {busy && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-[#00d4ff] text-sm animate-pulse">
              {status === "searching" ? "Szukam…" : "Zapisuję…"}
            </span>
          </div>
        )}

        <button
          onClick={onRemove}
          disabled={busy}
          title="Usuń ten element"
          aria-label={`Usuń ${item.name}`}
          className="absolute top-1 right-1 w-6 h-6 rounded bg-black/70 text-white/70 hover:text-white hover:bg-red-600/80 text-sm leading-none disabled:opacity-40"
        >
          ×
        </button>
      </div>

      <div className="p-2 flex flex-col gap-2">
        {renaming ? (
          <form onSubmit={submitRename} className="flex flex-col gap-1">
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setRenaming(false);
              }}
              maxLength={LIMITS.maxItemNameLength}
              aria-label="Nazwa elementu"
              autoFocus
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-[#00d4ff]/60 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
            />
            <input
              value={draftAlternatives}
              onChange={(event) => setDraftAlternatives(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setRenaming(false);
              }}
              placeholder="Inne poprawne odpowiedzi, po przecinku"
              aria-label="Inne poprawne odpowiedzi"
              className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                type="submit"
                disabled={savingName || !draftName.trim()}
                className="text-[11px] py-1 rounded bg-[#00d4ff] text-black font-semibold disabled:opacity-40"
              >
                {savingName ? "Zapisuję…" : "Zapisz"}
              </button>
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700"
              >
                Anuluj
              </button>
            </div>
          </form>
        ) : onRename ? (
          <button
            onClick={startRename}
            disabled={busy}
            title="Zmień nazwę lub inne poprawne odpowiedzi"
            className="group flex items-center gap-1 text-left min-w-0 disabled:opacity-60"
          >
            <span className="font-semibold text-sm text-white truncate">
              {item.name}
            </span>
            <span
              aria-hidden="true"
              className="text-white/40 text-xs group-hover:text-[#00d4ff]"
            >
              ✎
            </span>
          </button>
        ) : (
          <p className="font-semibold text-sm text-white truncate" title={item.name}>
            {item.name}
          </p>
        )}

        {message && (
          <p
            className={`text-[11px] leading-tight ${
              status === "error" ? "text-red-300" : "text-white/50"
            }`}
          >
            {message}
          </p>
        )}

        <div className={`grid gap-1 ${onShuffle ? "grid-cols-3" : "grid-cols-2"}`}>
          {onShuffle && (
            <button
              onClick={onShuffle}
              disabled={busy || !canShuffle}
              title="Spróbuj następnego wyniku wyszukiwania"
              className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
            >
              Dalej
            </button>
          )}
          <button
            onClick={onSearch}
            disabled={busy}
            title="Wyszukaj inny obrazek"
            className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
          >
            Szukaj
          </button>
          <button
            onClick={onEdit}
            disabled={busy || !item.imageUrl}
            title="Przytnij lub wymaż tekst i znaki wodne"
            className="text-[11px] py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-40"
          >
            Edytuj
          </button>
        </div>
      </div>
    </div>
  );
}
