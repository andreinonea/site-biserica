"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import useResize from "./hooks/useResize";

type QuoteType = {
  text: string;
  author?: string;
};

const Quote = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const size = useResize();
  const aspect = size.x / size.y;

  const columnScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const titleScale = useTransform(scrollYProgress, [0.3, 0.8], [1, 0.6]);
  const titleOpacity = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 0]);

  const [quote, setQuote] = useState<QuoteType>({
    text: "Începe ziua cu rugăciune și vei avea pace.",
    author: "Proverb ortodox"
  });

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem("daily-quote");
    const savedDate = localStorage.getItem("daily-quote-date");

    if (saved && savedDate === today) {
      setQuote(JSON.parse(saved));
      return;
    }

    const fetchQuote = async () => {
      try {
        const res = await fetch("/data/quote.json");
        const data: QuoteType[] = await res.json();

        const dayOfYear = Math.floor(
          (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const selected = data[dayOfYear % data.length];
        setQuote(selected);
        localStorage.setItem("daily-quote", JSON.stringify(selected));
        localStorage.setItem("daily-quote-date", today);
      } catch (err) {
        console.warn("Eroare la încărcarea citatului:", err);
      }
    };

    fetchQuote();
  }, []);

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
              src="/assets/principal(1).webp"
              alt="stalpi"
              layout="fill"
              priority
              className="object-cover object-top z-1"
            />
          </motion.div>
        </div>

        <div className="mx-auto px-10 md:px-20 text-center select-text cursor-text">
          <motion.h1
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="translate-y-1/2 text-2xl text-shadow-lg lg:text-6xl z-2"
          >
            <span className="text-[#c95d43]">"</span>
            {quote.text}
            <span className="text-[#c95d43]">"</span>

            {quote.author && (
              <p className="mt-2 lg:ml-[50%] md:ml-[40%] ml-[20%] text-base">– {quote.author}</p>
            )}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="m-3 flex justify-center gap-1 mt-10 text-base"
            >
              <p className="">Glisează în jos</p>
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
