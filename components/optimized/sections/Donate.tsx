"use client";

import React, { useRef, useState, useEffect } from "react";
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

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  // Disable page scroll when popup is open
  useEffect(() => {
  const html = document.documentElement;
  const body = document.body;

  if (showPopup) {
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  } else {
    html.style.overflow = "";
    body.style.overflow = "";
  }

  return () => {
    html.style.overflow = "";
    body.style.overflow = "";
  };
}, [showPopup]);

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
              className="object-cover object-bottom"
              alt="stars background"
            />
            <div className="absolute inset-0 bg-black/40" />
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
              className="max-w-[60vw] text-base sm:text-lg text-white/90 z-3 drop-shadow-xl flex flex-col items-center"
            >
              "Foișorul" Smarandei Doamna, numit și al Mavrocordaților, are atâta nevoie
              de ajutorul tău, privitorule și omule drag, pentru a renaște din negura
              vremii și cenușa veacului trecut la mareția-i de odinioară. Dacă ai dare
              de suflet și dare de mână poți ajuta chiar acum lăsând darul tău
              <strong> aici </strong>.

              <button
                onClick={() => setShowPopup(true)}
                className="mt-4 text-sm underline underline-offset-4 text-white/80 hover:text-white pointer-events-auto"
              >
                Detalii pentru donație
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowPopup(false)} // tap outside closes
        >
          <div
            className="relative max-w-md w-full bg-[#02021fd5] shadow-xl backdrop-blur-xl text-white p-6 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()} // prevents closing when tapping inside
          >
            {/* Close with SVG */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 w-4 h-4  flex items-center justify-center 
  cursor-pointer hover:scale-110 transition"
            >
              <Image
                src="/icons/close-circle.svg"
                alt="Close"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </button>


            <p className="text-base leading-relaxed pt-2">
              Pentru depunerile ce le efectuați, contul Bisericii Foișor este
              <strong className="text-[#C59D30] animate-pulse"> RO77RNCB0069148541980001 </strong> deschis la BCR, CIF 13360648.
              <br /><br />
              Pentru sumele ce le depuneți vă rugăm să menționați la detalii:
              <strong className="text-[#C59D30]"> DONAȚIE </strong>.
            </p>
          </div>
        </div>
      )}

    </section>
  );
}
