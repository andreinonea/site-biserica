"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import Logo from "@/components/optimized/components/Logo"

const GoogleMap = dynamic(() => import('@/components/Map'), { ssr: false })

const MOBILE_MEDIA_QUERY = "(max-width: 768px)"

const Page = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA_QUERY)
    setIsMobile(media.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [])

  // optimized images (lower resolution for mobile)
  const bgTexture = isMobile
    ? "/background/mobile_wall.jpg"     // create a 1200px version
    : "/background/concrete_wall_003_diff_8k.jpg"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen   bg-[#c59d30] px-6 py-12 text-white overflow-x-hidden selection:bg-yellow-600 selection:text-black/90"
    >

      {/* SUPER LIGHTWEIGHT BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Image
          src={bgTexture}
          alt="Background texture"
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover opacity-30"
        />

        {/* simple tint layer – NO mix-blend-mode */}
        <div className="absolute inset-0 bg-[#c59d30]/35" />
      </div>

      <h1 className="text-4xl lg:text-5xl text-center mt-[100px] mb-12 text-black/90">
        Contact
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-10 text-black">

        {/* PHONE */}
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

        {/* ADDRESS */}
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

        {/* EMAIL */}
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

        {/* MAP */}
        <div className="border-t border-black/20 pt-6 mt-6">
          <GoogleMap />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Logo theme="dark" />
      </div>

    </motion.div>
  )
}

export default Page
