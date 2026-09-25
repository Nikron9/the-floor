"use client";

import { useEffect, useState } from "react";

import BackLink from "@/app/components/BackLink";
import CuratedAdminPanel from "@/app/components/curated/CuratedAdminPanel";
import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";

import { getAdminSession, signInAsAdmin, signOutAsAdmin } from "./api";

/**
 * The admin's page: sign in with the shared secret, then manage the curated
 * image editor -- the shared editing PIN and every image swapped so far.
 */
export default function AdminPage() {
  const [session, setSession] = useState<{
    admin: boolean;
    configured: boolean;
  } | null>(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminSession()
      .then(setSession)
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Nie udało się wczytać.");
        setSession({ admin: false, configured: false });
      });
  }, []);

  const onSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signInAsAdmin(secret);
      setSecret("");
      setSession({ admin: true, configured: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Logowanie nie powiodło się.");
    }
  };

  const onSignOut = async () => {
    await signOutAsAdmin().catch(() => undefined);
    setSession({ admin: false, configured: true });
  };

  if (!session) {
    return (
      <FloorPageLayout>
        <p className="text-white/60 p-20 text-center">Ładowanie…</p>
      </FloorPageLayout>
    );
  }

  if (!session.admin) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-16 max-w-md mx-auto flex flex-col gap-6">
          <div>
            <BackLink href="/categories">Kategorie</BackLink>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "var(--color-neon)" }}
            >
              Administrator
            </h1>
          </div>

          {session.configured ? (
            <form onSubmit={onSignIn} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-semibold" style={{ color: "var(--color-neon)" }}>
                  Hasło administratora
                </span>
                <input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  className="bg-gray-800 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon"
                />
              </label>
              {error && <p className="text-red-300">{error}</p>}
              <FloorButton
                type="submit"
                variant="rectangular"
                className="font-semibold"
                disabled={secret.length === 0}
              >
                Zaloguj się
              </FloorButton>
            </form>
          ) : (
            <p className="text-white/70">
              To wdrożenie nie ma administratora. Ustaw{" "}
              <code className="text-neon">COMMUNITY_ADMIN_SECRET</code> w
              zmiennych środowiskowych i wdróż ponownie, aby go dodać.
            </p>
          )}
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout>
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <BackLink href="/categories">Kategorie</BackLink>
            <h1
              className="text-4xl font-bold glow-text mt-2"
              style={{ color: "var(--color-neon)" }}
            >
              Administrator
            </h1>
          </div>
          <button
            onClick={onSignOut}
            className="text-sm text-white/50 hover:text-white underline"
          >
            Wyloguj się
          </button>
        </div>

        <CuratedAdminPanel />
      </div>
    </FloorPageLayout>
  );
}
