"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

import { useHalloweenTheme } from "./useHalloweenTheme";

/**
 * Seasonal Lottie decorations, shown only while the Halloween theme is on.
 *
 * They sit behind the page content (content wrappers use z-10), never take
 * clicks, and load lazily: the classic theme downloads neither the player nor
 * the animation files. Files live in public/animations/halloween/.
 */

/** Part of the animation canvas to show: x, y, width, height (Lottie units). */
type ViewBox = [number, number, number, number];

interface Decor {
  /** Stand on the fixed bottom bar when the page shows one (else on the screen edge). */
  onBottomBar?: boolean;
  /** Position and size (Tailwind classes, applied to a fixed element). */
  className: string;
  /** File name in public/animations/halloween/, without ".json". */
  file: string;
  /** Wrap in the bat-flight path that crosses the screen now and then. */
  fly?: boolean;
  /** Play once and hold the last frame instead of looping. */
  once?: boolean;
  /**
   * Crop the canvas to the drawing, so the figure itself (not its empty
   * margin) touches the screen edge it is placed against.
   */
  viewBox?: ViewBox;
}

// Measured from the drawings' resting frames.
const CAT_VIEWBOX: ViewBox = [75, 0, 640, 635];
const BROOM_VIEWBOX: ViewBox = [200, 85, 700, 425];
const GHOST_VIEWBOX: ViewBox = [139, 171, 690, 614];

const DECOR_BY_PAGE: { items: Decor[]; match: (path: string) => boolean }[] = [
  {
    items: [
      { className: "-top-14 -left-14 w-44 md:-top-20 md:-left-20 md:w-80", file: "web" },
      { className: "top-4 right-4 w-24 md:top-8 md:right-10 md:w-40", file: "moon" },
      { className: "top-0 right-[22%] w-44 hidden md:block", file: "spider", once: true },
      { className: "bottom-0 left-0 w-40 md:w-64", file: "cat-cauldron", viewBox: CAT_VIEWBOX },
      { className: "top-0 left-0 w-20 md:w-28 hidden md:block", file: "bat", fly: true },
    ],
    match: (path) => path === "/",
  },
  {
    items: [
      { className: "top-2 right-2 w-64 hidden xl:block", file: "bats" },
      { className: "bottom-6 right-6 w-36 hidden xl:block", file: "ghost", viewBox: GHOST_VIEWBOX },
    ],
    match: (path) => path === "/categories",
  },
  {
    items: [
      { className: "bottom-6 right-6 w-48 hidden md:block", file: "jar-hand" },
      { className: "bottom-8 left-6 w-36 hidden md:block", file: "ghost", viewBox: GHOST_VIEWBOX },
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
      { className: "right-6 w-48 hidden xl:block", file: "broom", onBottomBar: true, viewBox: BROOM_VIEWBOX },
      { className: "left-6 w-28 hidden xl:block", file: "ghost", onBottomBar: true, viewBox: GHOST_VIEWBOX },
    ],
    match: (path) => path === "/presenter",
  },
  {
    items: [{ className: "-top-16 -left-16 w-56", file: "web" }],
    match: (path) => path === "/projector",
  },
];

/** Height of the page's fixed bottom bar (`data-bottom-bar`), or 0 without one. */
const useBottomBarHeight = (enabled: boolean): number => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let current: Element | null = null;
    let resize: ResizeObserver | undefined;
    const attach = () => {
      const bar = document.querySelector("[data-bottom-bar]");
      if (bar === current) return;
      resize?.disconnect();
      current = bar;
      if (!bar) {
        setHeight(0);
        return;
      }
      resize = new ResizeObserver(() => setHeight(bar.getBoundingClientRect().height));
      resize.observe(bar);
    };
    attach();
    const mutations = new MutationObserver(attach);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [enabled]);
  return height;
};

function LottieDecor({ file, once, viewBox }: Pick<Decor, "file" | "once" | "viewBox">) {
  const container = useRef<HTMLDivElement>(null);
  const viewBoxSize = viewBox?.join(" ");

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
        rendererSettings: viewBoxSize ? { viewBoxSize } : undefined,
      });
      if (still) animation.goToAndStop(Math.floor(animation.totalFrames * (once ? 0.99 : 0.6)), true);
    })().catch(() => {
      // A decoration that fails to load is simply not shown.
    });
    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [file, once, viewBoxSize]);

  return (
    <div
      ref={container}
      className="w-full [&>svg]:block"
      style={viewBox ? { aspectRatio: `${viewBox[2]} / ${viewBox[3]}` } : undefined}
    />
  );
}

export default function HalloweenDecor() {
  const pathname = usePathname();
  const halloween = useHalloweenTheme();
  const items = halloween ? (DECOR_BY_PAGE.find((page) => page.match(pathname))?.items ?? []) : [];
  const barHeight = useBottomBarHeight(items.some((item) => item.onBottomBar));
  if (items.length === 0) return null;

  return (
    <div aria-hidden="true" className="halloween-decor">
      {items.map((item) => (
        <div
          key={`${pathname}-${item.file}-${item.className}`}
          className={`fixed pointer-events-none select-none ${item.fly ? "halloween-bat-flight " : ""}${item.className}`}
          style={item.onBottomBar ? { bottom: barHeight } : undefined}
        >
          <LottieDecor file={item.file} once={item.once} viewBox={item.viewBox} />
        </div>
      ))}
    </div>
  );
}
