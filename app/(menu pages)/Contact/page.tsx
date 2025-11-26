'use client'

import { motion } from 'framer-motion'
import { MapPin, Mail } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Logo from '@/components/optimized/components/Logo'

const GoogleMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
})

const Page = () => {
  return (
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
   <h1 className="text-4xl lg:text-5xl text-center mt-[100px] mb-12 text-white/90">
        Contact
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Telefon */}
        <div className="flex items-start gap-4">
          <Image src="/icons/phone.svg" alt="phone" width={28} height={28} />
          <div className="flex flex-col">
            <p className="text-lg lg:text-xl font-medium text-white/90">Telefon</p>
            <div className="mt-2 flex flex-col gap-2 text-white/70 text-sm lg:text-base">
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

        {/* Adresă */}
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 mt-1 text-[#c95d43]" />
          <div>
            <p className="text-lg lg:text-xl font-medium text-white/90">Adresă</p>
            <p className="text-white/70 lg:text-base">
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

        {/* Email */}
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 mt-1 text-[#c95d43]" />
          <div>
            <p className="text-lg lg:text-xl font-medium text-white/90">Email</p>
            <a href="mailto:contact@biserica.com" className="text-white/70 lg:text-base hover:underline">
              bisericafoisor@gmail.com
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="border-t border-white/20 pt-6 mt-6">
          <GoogleMap />
        </div>

      </div>

      <div className="flex justify-center mt-10">
        <Logo theme='light' />
      </div>
    </motion.div>
  )
}

export default Page





//         <div className="absolute mask-b-from-0 inset-0 isolate w-full opacity-20 z-6 pointer-events-none">
//           <div className="relative h-full overflow-x-hidden">
//             <Image
//               fill
//               className="z-4 object-cover absolute mix-blend-multiply"
//               alt="background"
//               src={"/background/concrete_wall_003_rough_8k.jpg"}
//             />
//             <Image
//               className="z-2 blur-md bg-black-800 object-cover"
//               src={"/assets/fundal-program.png"}
//               alt="program-background"
//               fill
//             />
//             <div className="absolute inset-0 z-5 bg-gradient-to-b
//                         from-[#FFDB99]/80 via-[#D49649]/50 to-[#5E2308]/90
//                         mix-blend-overlay" />
//           </div>
//         </div>