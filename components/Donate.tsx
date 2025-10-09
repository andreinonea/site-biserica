"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DonatePage({ opacity = 1, x = 0, y = 0 }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const clampedProgress = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1)
  );

  const scale = useTransform(clampedProgress, [0, 0.5, 1], [2, 1.12, 1]);
  const baseY = useTransform(clampedProgress, [0, 0.5, 1], [220, 40, 0]);
  const imageY = useTransform(baseY, (value) => value + y);

  const titleOpacity = useTransform(clampedProgress, [0.45, 0.65], [0, 1]);
  const titleY = useTransform(clampedProgress, [0.65, 0.85], [100, -50]);
  const subtitleOpacity = useTransform(clampedProgress, [0.5, 0.7], [0, 1]);
  const subtitleY = useTransform(clampedProgress, [0.6, 0.9], [120, -80]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] h-[180vh] w-screen text-lg text-black"
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
        <motion.div
          className="relative h-full w-full object-top"
          style={{
            scale,
            opacity,
            x,
            y: imageY,
            transformOrigin: "center bottom",
          }}
        >
          <Image
            fill
            sizes="100vw"
            src="/assets/iesire.png"
            priority
            quality={100}
            className="object-cover object-bottom"
            alt="background"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <motion.h2
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-4xl font-semibold tracking-tight drop-shadow-lg"
            >
              Support Our Mission
            </motion.h2>
            <motion.p
              style={{ opacity: subtitleOpacity, y: subtitleY }}
              className="max-w-xl text-base text-white/80 sm:text-lg text-shadow-black/50 shadow-2xs"
            >
              Discover how your generosity helps us serve the community every day.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
