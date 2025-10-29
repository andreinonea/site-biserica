"use client";

import { useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { PropsWithChildren, useEffect, useState } from "react";
import { motion } from "framer-motion";
import VerticalParallax from "../Parallax";

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

export default function Background({
  classname,
  children,
}: PropsWithChildren & { classname?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 1000]);

  const sparkle = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.2, 0.4, 0.5, 1],
    [0, 0, 1, 0, 1, 0, 0]
  );
  const [usePhoneImages, setUsePhoneImages] = useState(false);

  useEffect(() => {
    if (typeof window != 'undefined'){
      const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
      const handleChange = (event: MediaQueryListEvent) => {
        setUsePhoneImages(event.matches);
      };
  
      setUsePhoneImages(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const diffuseSrc = usePhoneImages
    ? "/background/concrete_wall_003_diff_8k_phone.jpg"
    : "/background/concrete_wall_003_diff_8k.jpg";

  const displacementSrc = usePhoneImages
    ? "/background/concrete_wall_003_disp_8k_phone.webp"
    : "/background/concrete_wall_003_disp_8k.webp";

  return (
    <div className="relative w-full">
      {/* BACKGROUND: always behind */}
      <motion.div
        className={`absolute inset-0 h-[500vh] w-full overflow-hidden ${classname ?? ""}`}
        id="background-diffuse"
        style={{ y, backgroundColor: "var(--background)" }}
      >
        <Image
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
          alt="background"
          src={diffuseSrc}
        />
        <motion.div
          style={{ opacity: sparkle }}
          className="absolute inset-0 pointer-events-none mix-blend-color-burn"
        >
          <Image
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            alt="background"
            src={displacementSrc}
          />
        </motion.div>
        <div className="h-full absolute" />
      </motion.div>

      {/* PARALLAX + CONTENT */}
      <VerticalParallax>{children}</VerticalParallax>
    </div>
  );
}
