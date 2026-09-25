"use client";

import FloorPageLayout from "./components/FloorPageLayout";
import FloorButton from "./components/FloorButton";
import MenuHero, { MENU_BUTTON_CLASS, MENU_BUTTONS_CLASS } from "./components/MenuHero";
import Link from "next/link";

export default function HomePage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8 md:p-20">
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-[3vh]">
          <MenuHero tagline="Fanowska gra online" halloweenTagline="Mroczna edycja" />

          <div className={MENU_BUTTONS_CLASS}>
            <Link href="/presenter" prefetch={false} className="w-full">
              <FloorButton variant="rectangular" className={`btn-primary ${MENU_BUTTON_CLASS}`}>
                Zacznij grać
              </FloorButton>
            </Link>
            <Link href="/categories" prefetch={false} className="w-full">
              <FloorButton variant="rectangular" className={MENU_BUTTON_CLASS}>
                Przeglądaj kategorie
              </FloorButton>
            </Link>
          </div>
        </div>
      </div>

      <nav
        aria-label="Więcej"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-20 flex gap-3"
      >
        <Link href="/settings" prefetch={false} className="btn-glow icon-btn" aria-label="Ustawienia" title="Ustawienia">
          {/* Material Icons "settings" (Apache 2.0) */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </Link>
        <Link href="/about" prefetch={false} className="btn-glow icon-btn" aria-label="O grze" title="O grze">
          {/* Material Icons "info_outline" (Apache 2.0) */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </Link>
      </nav>
    </FloorPageLayout>
  );
}
