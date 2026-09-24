/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";

const SIZES = {
  sm: "h-20",
  md: "h-36",
  lg: "h-32 md:h-56",
} as const;

/**
 * The game's logo: the gold "THE FLOOR" wordmark with its corner brackets,
 * a transparent WebP in public/ (cropped from the source image, 1400px wide
 * so it stays sharp at projector sizes).
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
      src="/the-floor-logo.webp"
      alt="The Floor"
      width={1400}
      height={729}
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
