"use client";
import React, { useState } from "react";
import Image from "next/image";

type Slide = {
    image: string;
    caption?: string;
};

type SimpleCarouselProps = {
    slides: Slide[];
};

export default function SimpleCarousel({ slides }: SimpleCarouselProps) {
const [current, setCurrent] = useState(0);

if (!slides || slides.length === 0) return null;

const prev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
};

const next = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
};

return (
<div className="relative">
    <div className="flex items-center justify-center gap-4">
  {/* Left Arrow */}
  <button
    onClick={prev}
    className="text-[#C59D30] text-2xl hover:text-yellow-400 rounded-full p-2"
    aria-label="Previous Slide"
  >
    &#10094;
  </button>

  {/* Image */}
  <div className="relative h-64 w-full max-w-md rounded overflow-hidden border border-white/20">
    <Image
      src={slides[current].image}
      alt={slides[current].caption || `Slide ${current + 1}`}
      fill
      className="object-cover"
      priority
    />
  </div>

  {/* Right Arrow */}
  <button
    onClick={next}
    className="text-[#C59D30] text-2xl hover:text-yellow-400 rounded-full p-2"
    aria-label="Next Slide"
  >
    &#10095;
  </button>
</div>


 

  <div className="flex gap-2 justify-center items-center mt-2">
    {slides.map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full ${
          index === current ? "bg-[#C59D30]" : "bg-white/30"
        }`}
      />
    ))}
  </div>

 
</div>

);
}
