"use client";

import Scene from "./Scene";

export default function HeroSection() {
  return (
    <section className="relative h-[150vh] lg:h-[160vh]" style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black calc(100% - 300px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black calc(100% - 300px), transparent 100%)",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}>
      <Scene />
    </section>
  );
}
