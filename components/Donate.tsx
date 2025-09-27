"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DonatePage({ opacity = 1, x = 0, y = 0 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, (value) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    return 4 - 3 * clamped;
  });
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.5, 0.7], [40, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.6, 0.8], [40, 0]);

  return (
    <>
      <div className="relative z-2 h-[300vh] w-screen overflow-hidden text-lg text-black">
        <div className="relative h-full" ref={ref}>
          <motion.div
            style={{ scale, transformOrigin: "center center" }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              fill
              sizes="100vw"
              src="/assets/Sfinti.jpg"
              priority
              quality={100}
              className="object-cover"
              alt="background"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <motion.h2
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-4xl font-semibold tracking-tight drop-shadow-lg"
            >
              Support Our Mission
            </motion.h2>
            <motion.p
              style={{ opacity: subtitleOpacity, y: subtitleY }}
              className="max-w-xl text-base text-white/80 sm:text-lg"
            >
              Discover how your generosity helps us serve the community every day.
            </motion.p>
          </div>
        </div>
      </div>
    </>
  );
}
