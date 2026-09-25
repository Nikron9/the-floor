import FloorLogo from "./FloorLogo";

/**
 * Logo and tagline shared by the start screen and the game-mode screen, so
 * the two look the same size. The Halloween theme swaps the tagline through
 * CSS (.only-classic / .only-halloween), which avoids a flash on load.
 */

/** Column of menu buttons under the hero. */
export const MENU_BUTTONS_CLASS = "flex flex-col gap-4 w-full max-w-sm";
/** Each menu button in that column. */
export const MENU_BUTTON_CLASS = "w-full whitespace-nowrap font-bold text-base";

interface MenuHeroProps {
  halloweenTagline: string;
  tagline: string;
}

export default function MenuHero({ halloweenTagline, tagline }: MenuHeroProps) {
  return (
    <div className="flex flex-col items-center gap-[2vh]">
      <h1 className="flex justify-center">
        <FloorLogo size="hero" />
      </h1>
      <p className="text-lg md:text-2xl glow-text uppercase tracking-[0.2em]">
        <span className="only-classic">{tagline}</span>
        <span className="only-halloween">{halloweenTagline}</span>
      </p>
    </div>
  );
}
