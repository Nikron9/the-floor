import classNames from "classnames";

const SIZES = {
  sm: { the: "text-base", floor: "text-4xl" },
  md: { the: "text-2xl", floor: "text-6xl" },
  lg: { the: "text-3xl md:text-5xl", floor: "text-7xl md:text-9xl" },
} as const;

/**
 * The game's wordmark: "THE" in white over a gold "FLOOR", on a hex-ended
 * plate with a neon edge. Pure CSS (see `.logo-badge` in globals.css), so it
 * stays sharp at projector sizes.
 */
export default function FloorLogo({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const sizes = SIZES[size];

  return (
    <div className={classNames("logo-badge-frame", className)}>
      <div className="logo-badge" role="img" aria-label="The Floor">
        <span
          className={classNames(
            sizes.the,
            "font-black tracking-[0.12em] text-white drop-shadow-[0_0_8px_rgba(143,211,255,0.8)]"
          )}
          aria-hidden="true"
        >
          THE
        </span>
        <span className={classNames(sizes.floor, "metallic-text")} aria-hidden="true">
          FLOOR
        </span>
      </div>
    </div>
  );
}
