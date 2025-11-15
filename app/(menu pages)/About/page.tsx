"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/optimized/components/Logo";

const aboutSections = [
  {
    title: "Lorem ipsum dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat eros nec odio volutpat, ac pretium metus lacinia.",
    image: "/assets/imagine-biserica.png",
    imageAlt: "Interiorul bisericii"
  },
  {
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo massa vel nisl tincidunt, in vehicula dui elementum.",
    image: "/assets/Sfinti.jpg",
    imageAlt: "Detaliu cu sfinti pictati pe pereti"
  },
  {
    title: "Lorem ipsum dolor amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nibh turpis. Pellentesque posuere ante non justo molestie fermentum.",
    image: "/principal.png",
    imageAlt: "Credinciosi reuniti in biserica"
  }
];

type ParallaxImageProps = {
  src: string;
  alt: string;
  direction: "left" | "right";
};

const ParallaxImage = ({ src, alt, direction }: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], direction === "left" ? [-30, 30] : [30, -30]);

  return (
    <div ref={ref} className="relative h-[260px] sm:h-[320px] md:h-[360px] lg:h-[420px]">
      <motion.div
        style={{ y }}
        className="relative h-full w-full overflow-hidden rounded-xl shadow-xl"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
        />
      </motion.div>
    </div>
  );
};

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

const AboutPage = () => {
  const [usePhoneImages, setUsePhoneImages] = useState(false);

  useEffect(() => {
    if (typeof window != "undefined"){

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
    ? "/background/concrete_wall_003_disp_8k_phone.png"
    : "/background/concrete_wall_003_disp_8k.png";

  return (
    <div className="relative overflow-hidden bg-[#c59d30] pt-10 selection:bg-yellow-600 selection:text-black/90">
       <motion.div
        className={`absolute inset-0 h-[300vh] w-full opacity-10 overflow-hidden`}
        id="background-diffuse"
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


      <motion.div className="absolute inset-0 -z-10">
        <Image
          fill
          className="absolute inset-0 object-cover opacity-30"
          alt="Fundal texturat"
          src="/background/concrete_wall_003_diff_8k.jpg"
          sizes="100vw"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative z-2 min-h-screen  text-[#2b220a]"
      >
        <div className="mx-auto  md:px-[15vw] px-2 space-y-24">
          <header className="max-w-3xl px-10 py-20">
            <p className="text-sm uppercase tracking-[0.4em] text-[#d6c298]">Despre noi</p>
            <h1 className="mt-4 text-4xl font-semibold uppercase md:text-5xl">
              Lorem ipsum dolor
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#473712]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu massa sed dolor maximus volutpat non nec velit. Integer ac ligula id lacus tempor finibus.
            </p>
          </header>

          <div className="space-y-20">
            {aboutSections.map((section, index) => {
              const imageFirst = index % 2 === 0;

              return (
                <div
                  key={section.title}
                  className="grid gap-10 grid-cols-2 md:items-center md:gap-16"
                >
                  <div className={imageFirst ? "order-1 md:order-1 self-center" : "order-2 md:order-2 self-center" }>
                    <ParallaxImage
                      src={section.image}
                      alt={section.imageAlt}
                      direction={imageFirst ? "left" : "right"}
                    />
                  </div>

                  <div
                    className={
                      imageFirst
                        ? "order-1 md:order-2 md:pl-12"
                        : "order-1 md:order-1 md:pr-12"
                    }
                  >
                    <h2 className="text-2xl font-semibold text-[#2b220a]">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[#463712]">
                      {section.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          <Logo />
      </motion.div>
    </div>
  );
};

export default AboutPage;





