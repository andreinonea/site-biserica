"use client";

import { useEffect, useRef, useState } from "react";
import { Cross } from "lucide-react";
import Image from "next/image";

interface iconFrameProps {
  bgColor?: string;
  textColor?: string;
  children?: any;
}

export default function IconFrame({
  bgColor = "bg-[#df5719]",
  textColor = "text-black/80",
  children,
}: iconFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = frameRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={`relative ${bgColor} ${textColor} font-medium cursor-pointer rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition`}
      style={{
        transform: inView ? "scale(1)" : "scale(0.92)",
        opacity: inView ? 1 : 0,
        transition: "transform 0.33s ease-out, opacity 0.33s ease-out",
        willChange: "transform, opacity",
      }}
    >
      {/* Decor background circles */}
      <div className="absolute">
        <div
          className={`rounded-full ${bgColor} w-7 h-7 absolute -top-4 left-1 -translate-x-1/2 grid place-items-center`}
        >
          <Image src="/icons/button.webp" alt="cross" width={14} height={20} />
        </div>
      </div>
      {children}
    </div>
  );
}
