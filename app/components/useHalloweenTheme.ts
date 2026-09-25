"use client";

import { useEffect, useState } from "react";

/**
 * Whether the Halloween theme is on right now. Follows `data-theme` on
 * <html>, so it updates when the theme is switched in settings. False on the
 * server and during the first render.
 */
export const useHalloweenTheme = (): boolean => {
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
