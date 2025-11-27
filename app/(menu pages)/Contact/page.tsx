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
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <motion.div
          className="absolute inset-0 h-[300vh] w-full opacity-10 overflow-hidden"
          id="background-diffuse"
        >
          <Image
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            alt="background diffuse"
            src={diffuseSrc}
          />

          <div className="h-full absolute" />
        </motion.div>

        <motion.div className="absolute inset-0">
          <Image
            fill
            className="absolute inset-0 object-cover opacity-30"
            alt="Fundal texturat"
            src="/background/concrete_wall_003_diff_8k.jpg"
            sizes="100vw"
            priority
          />
        </motion.div>
      </div>

      <h1 className="text-4xl lg:text-5xl text-center mt-[100px] mb-12 text-black/90">
        Contact
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-10 text-black">

        <div className="flex items-start gap-4">
          <Image src="/icons/phone.svg" alt="phone" width={28} height={28} />
          <div>
            <p className="text-lg lg:text-xl font-medium">Telefon</p>

            <div className="mt-2 flex flex-col gap-3 text-black/70 text-sm lg:text-base">

              <div className="flex flex-col gap-1">
                <span>Preot Sorin Petre Georgescu</span>
                <a href="tel:+40742039585" className="text-[#c95d43] hover:underline">
                  +40 742 039 585
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <span>Preot Constantin Sandu</span>
                <a href="tel:+40723929011" className="text-[#c95d43] hover:underline">
                  +40 723 929 011
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <span>Preot Gheorghe Oprea</span>
                <a href="tel:+40723257569" className="text-[#c95d43] hover:underline">
                  +40 723 257 569
                </a>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 mt-1 text-[#c95d43]" />
          <div>
            <p className="text-lg lg:text-xl font-medium">Adresă</p>
            <p className="text-black/70 lg:text-base">
              Strada Foișorului Nr. 119, București
            </p>
            <a
              href="https://www.google.com/maps/place/Strada+Foișorului+119,+București"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm lg:text-base text-[#c95d43] hover:underline"
            >
              Vezi pe Google Maps
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 mt-1 text-[#c95d43]" />
          <div>
            <p className="text-lg lg:text-xl font-medium">Email</p>
            <a
              href="mailto:bisericafoisor@gmail.com"
              className="text-black/70 lg:text-base hover:underline"
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
