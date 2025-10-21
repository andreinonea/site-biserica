"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type BackgroundProps = {
  primarySrc?: string;
  secondarySrc?: string;
  className?: string;
  priority?: boolean;
};

const DEFAULT_PRIMARY = "/background/concrete_wall_003_diff_2k.webp";
const DEFAULT_SECONDARY = "/background/concrete_wall_003_diff_2k.webp";

export default function Background({
  primarySrc = DEFAULT_PRIMARY,
  secondarySrc = DEFAULT_SECONDARY,
  className,
  priority = false,
}: BackgroundProps) {
  const firstImageRef = useRef<HTMLDivElement>(null);
  const secondImageRef = useRef<HTMLDivElement>(null);

  const containerClassName = useMemo(
    () =>
      [
        "pointer-events-none fixed inset-0  overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const first = firstImageRef.current;
    const second = secondImageRef.current;

    if (!first || !second) {
      return;
    }

    const segments = [first, second];
    const segmentCount = segments.length;

    let viewportHeight = Math.max(window.innerHeight || 0, 1);
    let loopLength = viewportHeight * segmentCount;

    const reposition = (scrollPosition: number) => {
      if (!loopLength) {
        return;
      }

      const normalizedScroll =
        ((scrollPosition % loopLength) + loopLength) % loopLength;

      segments.forEach((element, index) => {
        let y = index * viewportHeight - normalizedScroll;
        // recycle panels whenever they fully exit the viewport in either direction
        if (y <= -viewportHeight) {
          y += loopLength;
        } else if (y >= viewportHeight) {
          y -= loopLength;
        }

        gsap.set(element, { y });
      });
    };

    const handleResize = () => {
      viewportHeight = Math.max(window.innerHeight || 0, 1);
      loopLength = viewportHeight * segmentCount;
      reposition(window.scrollY || 0);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => reposition(self.scroll()),
      onRefresh: (self) => {
        viewportHeight = Math.max(window.innerHeight || 0, 1);
        loopLength = viewportHeight * segmentCount;
        reposition(self.scroll());
      },
    });

    // Initial positioning
    reposition(window.scrollY || 0);
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [primarySrc, secondarySrc]);

  return (
    <div className={containerClassName} aria-hidden={true}
      style={{
        backgroundColor: "var(--background)",mixBlendMode: "multiply", opacity: 0.6 
      }}
    >
      <div 
        ref={firstImageRef} 
        className="absolute inset-0 will-change-transform" 
         >
        <Image
          src={primarySrc}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          quality={100}
          className="object-cover"
        />
      </div>
      <div
        ref={secondImageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translate3d(0, 100%, 0)" }}
      >
        <Image
          src={secondarySrc}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          quality={100}
          className="object-cover"
        />
      </div>
    </div>
  );
}
