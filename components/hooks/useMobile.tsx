"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport width is below the given breakpoint (default 768px).
 * Listens to both window and visual viewport resizes.
 */
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      const width = window.visualViewport?.width ?? window.innerWidth;
      setIsMobile(width <= breakpoint);
    };

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [breakpoint]);

  return isMobile;
}
