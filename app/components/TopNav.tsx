"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

import FloorLogo from "./FloorLogo";

const LINKS = [
  { href: "/presenter", label: "Graj" },
  { href: "/categories", label: "Kategorie" },
] as const;

/**
 * The bar across the top of the menu pages: the logo back to the home page on
 * the left, the two places a host actually goes on the right. "O grze" lives
 * only on the home page.
 */
export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="w-full flex items-center justify-between gap-4 px-4 sm:px-8 py-3">
      <Link href="/" prefetch={false} aria-label="Strona główna" className="shrink-0">
        <FloorLogo size="nav" />
      </Link>
      <nav className="flex gap-2 sm:gap-3">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={classNames(
                "btn-glow rectangular text-xs sm:text-sm !px-4 !py-2",
                { active }
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
