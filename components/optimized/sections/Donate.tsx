"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import useFixedViewportHeight from "@/components/hooks/useFixedViewport";
import IconFrame from "../components/FrameButton";

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

  const scale = useTransform(clampedProgress, [0, 0.5, .8], [1.15, 1.3, 1.2]);
  const baseY = useTransform(clampedProgress, [0, 0.65, .7], [-120, 40, 0]);
  const imageY = useTransform(baseY, (value) => value + y);

  const titleOpacity = useTransform(clampedProgress, [0.35, 0.55], [0, 1]);
  const titleY = useTransform(clampedProgress, [0.35, 0.45, 0.55, 0.9], [-100, 50, 80, -50]);
  const subtitleY = useTransform(clampedProgress, [0.4, 0.5, 0.6, 0.95], [-30, 60, 80, -50]);
  const subtitleOpacity = useTransform(clampedProgress, [0.3, 0.4], [0, 1]);

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
        className="sticky top-0 h-screen w-screen overflow-hidden bg-black"
        style={{ height: pinnedHeight }}
      >

      <div className="absolute top-0 md:block hidden w-full h-15 overflow-hidden z-1">
        <Image
          src="/patterns/top-bar.png"
          alt="top-bar-pattern"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10 z-2  " />
      </div>

        <motion.div
          className="relative h-full w-full object-top left-1/2 top-1/2 -translate-1/2"
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
            src="/assets/iesire-wide.png"
            priority
            quality={100}
            className="object-cover object-bottom md:hidden z-2"
            alt="background"
          />
          <div>
          <Image
            fill
            sizes="100vw"
            src="/assets/poza-wide-md.png"
            priority
            quality={100}
            className="object-cover object-top hidden md:block  z-2"
            alt="background"
          />
            <div className="absolute inset-0 bg-black/50 z-2 hidden md:block " />

          </div>
            
          <div className="absolute inset-0 z-0 md:hidden md:scale-250 scale-180 left-1/2 top-1/2 -translate-1/2">
            <Image
              fill
              sizes="100vw"
              src="/assets/poza-wide.png"
              quality={100}
              className="object-cover object-bottom"
              alt="stars background"
            />
            <div className="absolute inset-0 bg-black/30 z-2  md:hidden " />
          </div>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <motion.h2
              style={{ opacity: titleOpacity, y: titleY }}
              className="text-2xl lg:text-5xl font-semibold tracking-tight drop-shadow-2xl z-3"
            >
              Daruind <span className="text-2xl lg:text-4xl byzantin">vei</span> dobandi
            </motion.h2>

            <div className=" flex flex-col items-center z-15 cursor-pointer">
              <motion.p
                style={{ opacity: subtitleOpacity, y: subtitleY }}
                className="max-w-[60vw] text-base sm:text-lg text-white/90 z-13 text-shadow-xs shadow-black/50"
              >
                <p className="mb-8">
                "Foișorul" Smarandei Doamna, numit și al Mavrocordaților, are atâta nevoie
                de ajutorul tău, privitorule și omule drag, pentru a renaște din negura
                  </p>
              <IconFrame
                bgColor="bg-[#786543]"
                textColor="text-[#ddd] max-w-70 mx-auto"
                >
                <button
                 onClick={() => setShowPopup(true)}
                 className=" underline underline-offset-4 z-10 py-1"

                >
                  Detalii pentru donație
                </button>
              </IconFrame>
              </motion.p>
              {/* <motion.p
                style={{ opacity: subtitleOpacity, y: subtitleY }}
                className="max-w-[60vw] text-base sm:text-lg text-white/90 z-3 drop-shadow-xl flex flex-col items-center"
              >
                vremii și cenușa veacului trecut la mareția-i de odinioară. Dacă ai dare
                de suflet și dare de mână poți ajuta chiar acum lăsând darul tău
                <strong> aici </strong>.

              </motion.p> */}
            </div>


          </div>
        </motion.div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowPopup(false)} // tap outside closes
        >
          <div
            className="relative max-w-md z-5 w-full bg-[#02021fd5] shadow-xl backdrop-blur-xl text-white p-6 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()} // prevents closing when tapping inside
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute z-5 top-3 right-3 w-4 h-4  flex items-center justify-center 
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
