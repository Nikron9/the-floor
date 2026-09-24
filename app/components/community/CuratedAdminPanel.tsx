/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import {
  getCuratedAccess,
  listCuratedOverridesForAdmin,
  revertCuratedImage,
  setCuratedPin,
  type AdminOverrideRow,
} from "@/app/categories/curatedApi";
import { LIMITS } from "@/lib/community/config";

/**
 * The admin's view of picture replacements in the built-in categories: the
 * shared edit PIN, and every replacement -- flagged when a later deploy
 * changed the original file (the replacement still wins) or when the example
 * no longer exists.
 */
export default function CuratedAdminPanel() {
  const [rows, setRows] = useState<AdminOverrideRow[]>([]);
  const [hasPin, setHasPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [{ overrides }, access] = await Promise.all([
        listCuratedOverridesForAdmin(),
        getCuratedAccess(),
      ]);
      setRows(overrides);
      setHasPin(access.hasPin);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się wczytać.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listCuratedOverridesForAdmin(), getCuratedAccess()])
      .then(([{ overrides }, access]) => {
        if (cancelled) return;
        setRows(overrides);
        setHasPin(access.hasPin);
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Nie udało się wczytać.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSetPin = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("");
    try {
      await setCuratedPin(newPin);
      setNewPin("");
      setHasPin(true);
      setNotice("Zapisano PIN. Stary (jeśli był) przestał działać.");
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Nie udało się zapisać PIN-u.");
    }
  };

  const onRevert = async (row: AdminOverrideRow) => {
    if (!window.confirm(`Wrócić do obrazka z repo dla „${row.name ?? row.image}”?`)) return;
    try {
      await revertCuratedImage(row.folder, row.image);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się.");
    }
  };

  return (
    <section className="neon-panel p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold" style={{ color: "var(--color-neon)" }}>
        Wbudowane kategorie
      </h2>

      <form onSubmit={onSetPin} className="flex flex-col gap-2 max-w-md">
        <p className="text-white/60 text-sm">
          {hasPin
            ? "Wspólny PIN jest ustawiony. Każdy, kto go zna, może podmieniać obrazki we wbudowanych kategoriach. Nowy PIN od razu wylogowuje wszystkich."
            : "PIN nie jest ustawiony, więc obrazki we wbudowanych kategoriach może podmieniać tylko administrator."}
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            pattern="\d*"
            maxLength={LIMITS.editPinMaxLength}
            value={newPin}
            onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))}
            placeholder={`${LIMITS.editPinMinLength}–${LIMITS.editPinMaxLength} cyfr`}
            aria-label="PIN do wbudowanych kategorii"
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md border border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon tracking-widest"
          />
          <FloorButton
            type="submit"
            variant="rectangular"
            className="text-sm font-semibold"
            disabled={newPin.length < LIMITS.editPinMinLength}
          >
            {hasPin ? "Zmień PIN" : "Ustaw PIN"}
          </FloorButton>
        </div>
        {notice && <p className="text-yellow-200 text-sm">{notice}</p>}
      </form>

      {error && <p className="text-red-300">{error}</p>}

      <h3 className="text-lg font-bold text-white">Podmienione obrazki ({rows.length})</h3>
      {rows.length === 0 ? (
        <p className="text-white/50 text-sm">Nic nie zostało podmienione.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={`${row.folder}/${row.image}`}
              className="flex items-center gap-3 border-b border-white/10 pb-2"
            >
              <img
                src={row.imageUrl}
                alt=""
                className="w-14 h-14 object-cover rounded"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {row.name ?? row.image}{" "}
                  <span className="text-white/50 font-normal">· {row.categoryName ?? row.folder}</span>
                </p>
                {row.repoChanged && (
                  <p className="text-yellow-200 text-xs">
                    Plik w repo się zmienił od podmiany. Nadal wyświetla się podmiana.
                  </p>
                )}
                {row.orphaned && (
                  <p className="text-red-300 text-xs">
                    Tego przykładu nie ma już w repo, więc podmiana nie jest używana.
                  </p>
                )}
              </div>
              {!row.orphaned && (
                <Link href={`/categories/edit/${row.folder}`} className="underline text-neon text-sm">
                  Otwórz
                </Link>
              )}
              <button onClick={() => onRevert(row)} className="text-sm underline text-white/70">
                {row.orphaned ? "Usuń" : "Wróć do repo"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
