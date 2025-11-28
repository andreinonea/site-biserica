"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Logo from "@/components/optimized/components/Logo";

const GoogleMap = dynamic(() => import('@/components/Map'), { ssr: false });

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

const Page = () => {
  const [usePhoneImages, setUsePhoneImages] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    setUsePhoneImages(media.matches);
    const handler = (e: MediaQueryListEvent) => setUsePhoneImages(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const diffuseSrc = usePhoneImages
    ? "/background/concrete_wall_003_diff_8k_phone.jpg"
    : "/background/concrete_wall_003_diff_8k.jpg";

  const displacementSrc = usePhoneImages
    ? "/background/concrete_wall_003_disp_8k_phone.png"
    : "/background/concrete_wall_003_disp_8k.png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-[#c59d30] px-6 py-12 text-white overflow-x-hidden selection:bg-yellow-600 selection:text-black/90"
    >
      {/* BACKGROUND */}
      <motion.div
        className="absolute inset-0 h-full w-full opacity-10 overflow-hidden"
      >
        {/* Diffuse layer */}
        <Image
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
          alt="background diffuse"
          src={diffuseSrc}
        />

        {/* Displacement / overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-color-burn"
        >
          <Image
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            alt="background displacement"
            src={displacementSrc}
          />
        </motion.div>

        <div className="h-full absolute" />
      </motion.div>

      <div className="relative z-2 max-w-3xl mx-auto flex flex-col gap-10 text-black">
        <h1 className="text-5xl  lg:text-6xl text-center mt-[100px] mb-12 text-black/90">
          Contact
        </h1>

        <div className="flex items-start gap-4">
          <Image src="/icons/phone.svg" alt="phone" width={28} height={28} />
          <div>
            <p className="text-2xl lg:text-3xl font-medium">Telefon</p>
            <div className="mt-2 flex flex-col text-black/70 text-lg lg:text-xl lg:text-base">
              <div className="flex flex-col mt-1">
                <span>Preot Sorin Petre Georgescu</span>
                <a href="tel:+40742039585" className="text-[#A33B20] hover:underline">
                  +40 742 039 585
                </a>
              </div>
              <div className="flex flex-col mt-1 ">
                <span>Preot Constantin Sandu</span>
                <a href="tel:+40723929011" className="text-[#A33B20] hover:underline">
                  +40 723 929 011
                </a>
              </div>
              <div className="flex flex-col mt-1">
                <span>Preot Gheorghe Oprea</span>
                <a href="tel:+40723257569" className="text-[#A33B20] hover:underline">
                  +40 723 257 569
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 mt-1 text-[#A33B20]" />
          <div>
            <p className="text-2xl lg:text-3xl font-medium">Adresă</p>
            <p className="text-black/70 text-lg lg:text-xl lg:text-base">
              Strada Foișorului Nr. 119, București
            </p>
            <a
              href="https://www.google.com/maps/place/Biserica+Foi%C8%99or/@44.4148078,26.1232117,816m/data=!3m1!1e3!4m15!1m8!3m7!1s0x40b1fee4b6582d25:0x1bdf1cb467c8b482!2sStrada+Foi%C8%99orului+119,+Bucure%C8%99ti+031178!3b1!8m2!3d44.4148018!4d26.1231604!16s%2Fg%2F11bw3z8s2j!3m5!1s0x40b1fee4b6582d25:0x456acf0f90f184d1!8m2!3d44.4147651!4d26.1230983!16s%2Fg%2F11bw8jsv4v?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-md lg:text-base text-[#A33B20] hover:underline"
            >
              Vezi pe Google Maps
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 mt-1 text-[#A33B20]" />
          <div>
            <p className="text-2xl lg:text-3xl font-medium">Email</p>
            <a
              href="mailto:bisericafoisor@gmail.com"
              className="text-[#A33B20] lg:text-base text-lg lg:text-xl hover:underline "
            >
              bisericafoisor@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-black/20 pt-6 mt-6">
          <GoogleMap />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Logo theme="dark" />
      </div>
    </motion.div>
  );
};

export default Page;
