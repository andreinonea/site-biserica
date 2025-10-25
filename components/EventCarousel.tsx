"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";

type SlideObj = { image: string; caption?: string };
type Slide = SlideObj | string;

export default function SimpleCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxX = useMotionValue(0);
  const lightboxContainerRef = useRef<HTMLDivElement | null>(null);
  const [lightboxWidth, setLightboxWidth] = useState(0);

  const slideGap = 16; // gap between slides

  // Disable background scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
  }, [lightboxOpen]);

  // Measure main carousel width
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Animate to current slide
  useEffect(() => {
    if (width === 0) return;
    animate(x, -current * (width + slideGap), { type: "spring", stiffness: 300, damping: 30 });
  }, [current, width, x]);

  // Measure lightbox width
  useEffect(() => {
    const update = () => {
      if (lightboxContainerRef.current) setLightboxWidth(lightboxContainerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (lightboxContainerRef.current) ro.observe(lightboxContainerRef.current);
    return () => ro.disconnect();
  }, [lightboxOpen]);

  // Animate lightbox to current slide
  useEffect(() => {
    if (lightboxWidth === 0) return;
    animate(lightboxX, -lightboxIndex * lightboxWidth, { type: "spring", stiffness: 300, damping: 30 });
  }, [lightboxIndex, lightboxWidth, lightboxX]);

  if (!slides || slides.length === 0) return null;

  const maxDrag = Math.max(0, (slides.length - 1) * (width + slideGap));
  const maxLightboxDrag = Math.max(0, (slides.length - 1) * lightboxWidth);

  const handleDragEnd = () => {

    let xEnd = x.get();
    const offset =  Math.abs(xEnd / (width + slideGap)) > current ? -width/5 : width/5 ;
    xEnd += offset;

    if (width === 0) return;
    const rawIndex = Math.round(Math.abs(xEnd) / (width + slideGap));
    const newIndex = Math.min(Math.max(rawIndex, 0), slides.length - 1);
    animate(x, -newIndex * (width + slideGap), { type: "spring", stiffness: 300, damping: 30 });
    setCurrent(newIndex);
  };

  const handleLightboxDragEnd = (_: any, info: any) => {
    let xEnd = lightboxX.get();
    const offset =  Math.abs(xEnd / lightboxWidth) > lightboxIndex ? -lightboxWidth/3 : lightboxWidth/3 ;
    xEnd += offset;
    if (lightboxWidth === 0) return;
    const rawIndex = Math.round(Math.abs(xEnd) / lightboxWidth);
    const newIndex = Math.min(Math.max(rawIndex, 0), slides.length - 1);
    animate(lightboxX, -newIndex * lightboxWidth, { type: "spring", stiffness: 300, damping: 30 });
    setLightboxIndex(newIndex);
  };

  const prev = () => setCurrent((p) => (p === 0 ? 0 : p - 1));
  const next = () => setCurrent((p) => (p === slides.length - 1 ? slides.length - 1 : p + 1));
  const lightboxPrev = () => setLightboxIndex((p) => (p === 0 ? 0 : p - 1));
  const lightboxNext = () => setLightboxIndex((p) => (p === slides.length - 1 ? slides.length - 1 : p + 1));

  return (
    <div className="relative group">
      <div className="flex items-center justify-center gap-4">
        {/* Left arrow (carousel) */}
        <button
          onClick={prev}
          className={`text-[#C59D30] text-2xl hover:text-yellow-400 rounded-full p-2 z-10 opacity-70 group-hover:opacity-100 transition cursor-pointer ${current === 0 ? "invisible" : "visible"
            }`}
          aria-label="Previous Slide"
        >
          &#10094;
        </button>

        {/* Carousel viewport */}
        <div
          ref={containerRef}
          className="relative h-64 md:h-80 w-full max-w-md rounded overflow-hidden border border-white/20"
        >
          <motion.div
            style={{ x }}
            className="flex h-full gap-[16px]"
            drag="x"
            dragConstraints={width ? { left: -maxDrag, right: 0 } : { left: 0, right: 0 }}
            dragElastic={0.001}
            onDragEnd={handleDragEnd}
          >
            {slides.map((s, i) => {
              const src = typeof s === "string" ? s : s.image;
              const caption = typeof s === "string" ? undefined : s.caption;
              return (
                <div
                  key={i}
                  className="relative h-full flex-shrink-0 cursor-pointer"
                  style={{ minWidth: width ? `${width}px` : "100%" }}
                  onClick={() => {
                    setLightboxOpen(true);
                    setLightboxIndex(i);
                  }}
                >
                  <Image
                    src={src}
                    alt={caption ?? `Slide ${i + 1}`}
                    fill
                    className="object-cover rounded"
                    priority
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/40 text-sm p-2 text-center">
                      {caption}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right arrow (carousel) */}
        <button
          onClick={next}
          className={`text-[#C59D30] text-2xl hover:text-yellow-400 rounded-full p-2 z-10 opacity-70 group-hover:opacity-100 transition cursor-pointer ${current === slides.length - 1 ? "invisible" : "visible"
            }`}
          aria-label="Next Slide"
        >
          &#10095;
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2 justify-center items-center mt-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition cursor-pointer ${index === current ? "bg-[#C59D30]" : "bg-white/30"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Lightbox Modal with polished effects */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Background with static blur */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
            ></div>

            {/* Lightbox Container */}
            <div
              ref={lightboxContainerRef}
              className="relative w-full max-w-3xl h-[80vh] flex items-center overflow-hidden"
            >
              {/* Left Arrow */}
              {lightboxIndex > 0 && (
                <button
                  onClick={lightboxPrev}
                  className="absolute left-2 text-white text-3xl z-50 cursor-pointer transition transform hover:scale-110 hover:text-yellow-400"
                >
                  &#10094;
                </button>
              )}

              {/* Right Arrow */}
              {lightboxIndex < slides.length - 1 && (
                <button
                  onClick={lightboxNext}
                  className="absolute right-2 text-white text-3xl z-50 cursor-pointer transition transform hover:scale-110 hover:text-yellow-400"
                >
                  &#10095;
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute md:top-0 top-18  right-1 text-white text-3xl z-50 cursor-pointer"
              >
                &times;
              </button>

              {/* Swipeable Images */}
              <motion.div
                style={{ x: lightboxX }}
                className="flex h-full w-full"
                drag="x"
                dragConstraints={
                  lightboxWidth ? { left: -maxLightboxDrag, right: 0 } : { left: 0, right: 0 }
                }
                dragElastic={0.08}
                onDragEnd={handleLightboxDragEnd}
              >
                {slides.map((s, i) => {
                  const src = typeof s === "string" ? s : s.image;
                  return (
                    <div
                      key={i}
                      className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={src}
                        alt={`Slide ${i + 1}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
