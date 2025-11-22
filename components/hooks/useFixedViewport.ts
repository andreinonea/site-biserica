"use client";

import { useEffect, useRef, useState } from "react";

const readViewportHeight = () => {
  if (typeof window === "undefined") return 0;
  const visual = window.visualViewport;
  return Math.round((visual?.height ?? window.innerHeight) || 0);
};

const readViewportWidth = () => {
  if (typeof window === "undefined") return 0;
  const visual = window.visualViewport;
  return Math.round((visual?.width ?? window.innerWidth) || 0);
};

/**
 * Locks the app to the initial viewport height so scroll/pin calculations
 * are not invalidated by mobile browser chrome showing/hiding.
 * It only updates on large size changes (e.g. orientation switch).
 */
export default function useFixedViewportHeight() {
  const [height, setHeight] = useState<number>(0);
  const heightRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyHeight = (nextHeight: number, nextWidth: number) => {
      if (!nextHeight) return;
      heightRef.current = nextHeight;
      widthRef.current = nextWidth;
      setHeight(nextHeight);
      document.documentElement.style.setProperty("--fixed-vh", `${nextHeight}px`);
    };

    const initialHeight = readViewportHeight();
    const initialWidth = readViewportWidth();
    applyHeight(initialHeight, initialWidth);

    const handleResize = () => {
      const nextHeight = readViewportHeight();
      const nextWidth = readViewportWidth();

      const widthDelta = Math.abs(nextWidth - (widthRef.current || nextWidth));
      const heightDelta = Math.abs(nextHeight - (heightRef.current || nextHeight));
      const orientationChanged = widthDelta > 80;
      const majorHeightChange = heightDelta > 160;

      // Ignore small resizes caused by bottom bars appearing/disappearing.
      if (!orientationChanged && !majorHeightChange) {
        return;
      }

      applyHeight(nextHeight, nextWidth);
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return height || heightRef.current || 0;
}
