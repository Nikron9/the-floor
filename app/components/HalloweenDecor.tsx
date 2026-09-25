"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * Seasonal Lottie decorations, shown only while the Halloween theme is on.
 *
 * They sit behind the page content (content wrappers use z-10), never take
 * clicks, and load lazily: the classic theme downloads neither the player nor
 * the animation files. Files live in public/animations/halloween/.
 */

interface Decor {
  /** File name in public/animations/halloween/, without ".json". */
  file: string;
  /** Position and size (Tailwind classes, applied to a fixed element). */
  className: string;
  /** Play once and hold the last frame instead of looping. */
  once?: boolean;
  /** Wrap in the bat-flight path that crosses the screen now and then. */
  fly?: boolean;
}

const DECOR_BY_PAGE: { match: (path: string) => boolean; items: Decor[] }[] = [
  {
    items: [
      { className: "-top-14 -left-14 w-44 md:-top-20 md:-left-20 md:w-80", file: "web" },
      { className: "top-4 right-4 w-24 md:top-8 md:right-10 md:w-40", file: "moon" },
      { className: "top-0 right-[22%] w-44 hidden md:block", file: "spider", once: true },
      { className: "bottom-2 left-2 w-40 md:bottom-4 md:left-6 md:w-64", file: "cat-cauldron" },
      { className: "top-0 left-0 w-20 md:w-28 hidden md:block", file: "bat", fly: true },
    ],
    match: (path) => path === "/",
  },
  {
    items: [
      { className: "top-2 right-2 w-64 hidden xl:block", file: "bats" },
      { className: "bottom-6 right-6 w-40 hidden xl:block", file: "ghost" },
    ],
    match: (path) => path === "/categories",
  },
  {
    items: [
      { className: "bottom-6 right-6 w-48 hidden md:block", file: "jar-hand" },
      { className: "bottom-8 left-6 w-40 hidden md:block", file: "ghost" },
    ],
    match: (path) => path === "/settings",
  },
  {
    items: [
      { className: "bottom-6 right-6 w-40 hidden md:block", file: "skull" },
      { className: "-top-20 -right-20 w-72 hidden md:block", file: "web" },
    ],
    match: (path) => path === "/about",
  },
  {
    items: [
      { className: "bottom-24 right-4 w-48 hidden xl:block", file: "broom" },
      { className: "bottom-24 left-4 w-32 hidden xl:block", file: "ghost-rising" },
    ],
    match: (path) => path === "/presenter",
  },
  {
    items: [
      { className: "-top-16 -left-16 w-56", file: "web" },
    ],
    match: (path) => path === "/projector",
  },
];

const useHalloweenTheme = (): boolean => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setOn(root.dataset.theme === "halloween");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributeFilter: ["data-theme"], attributes: true });
    return () => observer.disconnect();
  }, []);
  return on;
};

function LottieDecor({ file, once }: { file: string; once?: boolean }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem | undefined;
    let cancelled = false;
    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(`/animations/halloween/${file}.json`).then((response) => response.json()),
      ]);
      if (cancelled || !container.current) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      animation = lottie.loadAnimation({
        animationData: data,
        autoplay: !still,
        container: container.current,
        loop: !once,
        renderer: "svg",
      });
      if (still) animation.goToAndStop(Math.floor(animation.totalFrames * (once ? 0.99 : 0.3)), true);
    })().catch(() => {
      // A decoration that fails to load is simply not shown.
    });
    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [file, once]);

  return <div ref={container} className="w-full" />;
}

export default function HalloweenDecor() {
  const pathname = usePathname();
  const halloween = useHalloweenTheme();
  if (!halloween) return null;

  const items = DECOR_BY_PAGE.find((page) => page.match(pathname))?.items ?? [];
  return (
    <div aria-hidden="true" className="halloween-decor">
      {items.map((item) => (
        <div
          key={`${pathname}-${item.file}-${item.className}`}
          className={`fixed pointer-events-none select-none ${item.fly ? "halloween-bat-flight " : ""}${item.className}`}
        >
          <LottieDecor file={item.file} once={item.once} />
        </div>
      ))}
    </div>
  );
}
