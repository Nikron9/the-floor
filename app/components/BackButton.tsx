"use client";

import { useRouter } from "next/navigation";

/**
 * The plain "← Wstecz" button in the top-left corner of a page.
 *
 * Goes back in history when the visitor arrived from another page of this
 * site, otherwise to `fallback` -- a pasted link must not leave the site.
 * `onClick` replaces both, for in-page views such as a category's details.
 */
export default function BackButton({
  fallback = "/",
  onClick,
}: {
  fallback?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  const goBack = () => {
    if (onClick) return onClick();
    const cameFromHere =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1;
    if (cameFromHere) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="btn-glow rectangular !px-4 !py-2 text-xs sm:text-sm"
    >
      <span aria-hidden="true">←</span> Wstecz
    </button>
  );
}
