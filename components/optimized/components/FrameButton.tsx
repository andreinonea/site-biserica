"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flower } from "lucide-react";

interface iconFrameProps {
  bgColor?: string;
  textColor?: string;
  children? : any,
}

gsap.registerPlugin(ScrollTrigger);

export default function IconFrame({
  bgColor = "bg-[#df5719]",
  textColor = "text-black/80",
  children
}: iconFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { scale: 0.8 },
        {
          scale: 1,
          duration: 0.33,
          ease: "power1.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={frameRef}
      className={`relative ${bgColor} ${textColor} font-medium cursor-pointer rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition`}
    >
      {/* Decor background circles */}
      <div className="absolute">
        <div className={`rounded-full ${bgColor} w-7 h-7 absolute -top-4 left-0 -translate-x-1/2 grid place-items-center`}>
            <Flower className="w-4 h-4"/>
        </div>
       
      </div>
      {children}
    </div>
  );
}
