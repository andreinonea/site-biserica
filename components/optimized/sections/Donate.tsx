"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import useFixedViewportHeight from "@/components/hooks/useFixedViewport";

export default function DonatePage({ opacity = 1, x = 0, y = 0 }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fixedViewportHeight = useFixedViewportHeight();
  const pinnedHeight = fixedViewportHeight ? `${fixedViewportHeight}px` : undefined;
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
      className="relative z-2 w-screen text-lg text-black"
    >
      <div
        className="sticky top-0 h-screen w-screen overflow-hidden"
        style={{ height: pinnedHeight }}
      >
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
            src="/assets/iesire(1).png"
            priority
            quality={100}
            className="object-cover object-bottom md:hidden z-2"
            alt="background"
          />

          <div className="absolute inset-0 z-0">
            <Image
              fill
              sizes="100vw"
              src="/assets/stars.jpeg"
              quality={100}
              className="object-cover object-bottom "
              alt="stars background"
            />
            <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
          </div>




          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <motion.h2
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-4xl lg:text-5xl font-semibold tracking-tight drop-shadow-2xl z-3"
            >
              Daruind <span className="text-2xl lg:text-4xl byzantin">vei</span> dobandi
            </motion.h2>

            <motion.p
              style={{ opacity: subtitleOpacity, y: subtitleY }}
              className="max-w-[60vw] text-base sm:text-lg text-white/90 z-3 drop-shadow-xl"
            >
              "Foișorul" Smarandei Doamna, numit și al Mavrocordaților, are atâta nevoie de ajutorul tău, privitorule și omule drag, pentru a renaște din negura vremii și cenușa veacului trecut la mareția-i de odinioară. Dacă ai dare de suflet și dare de mână poți ajuta chiar acum lăsând darul tău <strong> aici </strong>.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
