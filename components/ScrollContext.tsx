"use client";

import { createContext, useContext, useEffect } from "react";
import Lenis from "lenis";
import { MotionValue, useScroll } from "framer-motion";

interface ScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

const isTouch = 'ontouchstart' in window;

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouch,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      <div className="bg-c59d30">
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollContext must be used inside ScrollProvider");
  }
  return ctx;
};
