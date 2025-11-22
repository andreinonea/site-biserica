'use client'

import { motion } from 'framer-motion'
import { MapPin, Mail } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Logo from '@/components/optimized/components/Logo'

const GoogleMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
})

const page = () => {
  return (
    <>
      <motion.div
        initial={{ scale: 0.95, borderRadius: '30px', opacity: 0 }}
        animate={{ scale: 1, borderRadius: '0px', opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: '30px', opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="min-h-screen bg-[#0A0004] px-6 py-12 text-white selection:bg-yellow-600 selection:text-white/90"
      >
        <div className="absolute mask-b-from-0 inset-0 isolate w-full opacity-20 z-6 pointer-events-none">
          <div className="relative h-full overflow-x-hidden">
            <Image
              fill
              className="z-4 object-cover absolute mix-blend-multiply"
              alt="background"
              src={"/background/concrete_wall_003_rough_8k.jpg"}
            />
            <Image
              className="z-2 blur-md bg-black-800 object-cover"
              src={"/assets/fundal-program.png"}
              alt="program-background"
              fill
            />
            <div className="absolute inset-0 z-5 bg-gradient-to-b 
                        from-[#FFDB99]/80 via-[#D49649]/50 to-[#5E2308]/90 
                        mix-blend-overlay" />
          </div>
        </div>
        <h1 className="flex justify-center text-4xl mt-[100px] mb-12 text-white/90">
          Contact
        </h1>

        <div className="max-w-3xl mx-auto space-y-10">

          <div className="flex items-start gap-4 flex-nowrap">
            <img src="./icons/phone.svg" alt="Phone" className="w-7 h-7 mt-1" />
            <div>
              <p className="text-lg font-medium text-white/90">Telefon</p>
              <a href="tel:+40712345678" className="text-white/70 hover:underline">
                +40 723 257 569
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 mt-1 text-[#c95d43]" />
            <div>
              <p className="text-lg font-medium text-white/90">Adresă</p>
              <p className="text-white/70">
                Strada Foișorului Nr. 119, București
              </p>
              <a
                href="https://www.google.com/maps/place/Strada+Foișorului+119,+București"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#c95d43] hover:underline"
              >
                Vezi pe Google Maps
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 mt-1 text-[#c95d43]" />
            <div>
              <p className="text-lg font-medium text-white/90">Email</p>
              <a href="mailto:contact@biserica.ro" className="text-white/70 hover:underline">
                bisericafoisor@gmail.ro
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 mt-6">
            <GoogleMap />
          </div>
        </div>
       <Logo theme='light' />
      </motion.div>
    </>
  )
}

export default page