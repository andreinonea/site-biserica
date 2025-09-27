"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import useResize from "./hooks/useResize";

const Quote = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const size = useResize();
  const aspect = size.x / size.y;
  const columnScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const titleScale = useTransform(scrollYProgress, [0.3, 1], [1, 0.6]);
  const titleOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 0]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-2 mx-auto h-[200vh] w-full max-w-[100vw] scroll-smooth"
    >
      <div className="pointer-events-auto sticky top-0 mx-auto flex min-h-screen w-full items-center justify-center overflow-hidden transition delay-300 duration-1000">
        <div className="absolute inset-0 z-0 mx-auto md:hidden">
          <motion.div
            className="relative mx-auto lg:w-full"
            style={{
              scale: columnScale,
              translateY: -aspect * 90,
              height: `calc(100vh + ${aspect * 20}vh)`
            }}
          >
            <Image
              src="/principal.png"
              alt="stalpi"
              layout="fill"
              priority
              className="object-cover object-top"
            />
          </motion.div>
        </div>
        <div className="mx-auto px-4 text-center text-white/80 select-text cursor-text">
          <motion.h1
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="translate-y-1/2 text-4xl text-shadow-lg text-shadow-black/20 lg:text-6xl"
          >
            <span className="text-[#c95d43]">"</span>
            Quote of the day
            <span className="text-[#c95d43]">"</span>
            <motion.div
              style={{ opacity: hintOpacity }}
              className="m-3 flex justify-center gap-2 text-base"
            >
              <p>Gliseaza in jos</p>
              <Image
                src="/icons/ScrollDownArrows.gif"
                alt="Scroll down"
                width={30}
                height={20}
                unoptimized
              />
            </motion.div>
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default Quote;