/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";

const SIZES = {
  sm: "h-20",
  md: "h-36",
  lg: "h-32 md:h-56",
  /** Scales with the viewport height so a menu fits without scrolling. */
  hero: "h-[clamp(4.5rem,22vh,13rem)]",
} as const;

/**
 * The game's logo: the gold "THE FLOOR" wordmark with its corner brackets,
 * a transparent WebP in public/, padded so the bracket frame sits exactly in
 * the middle of the image (the sparkle on the right used to pull it off
 * centre). New file name because public images are cached as immutable.
 */
export default function FloorLogo({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <img
      src="/the-floor-logo-v2.webp"
      alt="The Floor"
      width={1495}
      height={756}
      decoding="async"
      className={classNames(
        SIZES[size],
        "w-auto select-none",
        className
      )}
      draggable={false}
    />
  );
}
