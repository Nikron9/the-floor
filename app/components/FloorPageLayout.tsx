import React from "react";

import TopNav from "./TopNav";

interface FloorPageLayoutProps {
  children: React.ReactNode;
  /**
   * Show the navigation bar at the top. The content then fills the rest of
   * the screen below it (a centred menu stays centred in that space).
   */
  nav?: boolean;
}

export default function FloorPageLayout({ children, nav = false }: FloorPageLayoutProps) {
  if (nav) {
    return (
      <main className="relative min-h-dvh bg-black text-white flex flex-col overflow-x-hidden">
        <div className="absolute inset-0 grid-background pointer-events-none"></div>
        <div className="relative z-20 w-full">
          <TopNav />
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
