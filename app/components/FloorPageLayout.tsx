import React from "react";

import BackButton from "./BackButton";

interface FloorPageLayoutProps {
  children: React.ReactNode;
  /**
   * Show a "← Wstecz" button in the top-left corner: `true` for the default
   * behaviour, or the button's props. The content then fills the rest of the
   * screen below it (a centred menu stays centred in that space).
   */
  back?: boolean | React.ComponentProps<typeof BackButton>;
}

export default function FloorPageLayout({ children, back = false }: FloorPageLayoutProps) {
  if (back) {
    return (
      <main className="relative min-h-dvh bg-black text-white flex flex-col overflow-x-hidden">
        <div className="absolute inset-0 grid-background pointer-events-none"></div>
        <div className="relative z-20 w-full px-4 sm:px-8 pt-4">
          <BackButton {...(back === true ? {} : back)} />
        </div>
        <div className="relative z-10 w-full flex-1 flex flex-col">{children}</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none"></div>
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
