import Link from "next/link";
import React from "react";

/**
 * The "← up one level" link at the top of a page.
 *
 * A fixed destination rather than `history.back()`: these pages are opened
 * from shared links as often as by clicking through, and "back" from a link
 * someone pasted into a group chat would leave the site.
 */
export default function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-neon underline hover:text-white"
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
