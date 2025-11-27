"use client";

import Logo from "@/components/optimized/components/Logo";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div className="bg-[#0A0004]">
      <motion.div
        initial={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative min-h-screen w-full px-6 py-12 text-white overflow-hidden"
      >
        <div className="absolute mask-b-from-0 inset-0 isolate w-full opacity-30 z-6">
          <div className="relative w-full h-full">
            <Image
              fill
              priority
              alt="background-desktop"
              src={"/background/concrete_wall_003_rough_8k.webp"}
              className="hidden sm:block z-4 absolute object-cover object-center mix-blend-multiply"
            />

            <Image
              fill
              priority
              alt="background-mobile"
              src={"/background/concrete_wall_003_rough_8k phone.webp"}
              className="block sm:hidden z-4 absolute object-cover object-left mix-blend-multiply"
            />

            <Image
              className="z-2 blur-md bg-black-500 object-cover"
              src={"/assets/fundal-program_phone.webp"}
              alt="program-background"
              fill
            />

            <div
              className="absolute inset-0 z-5 bg-gradient-to-b 
                       from-[#FFDB99]/80 via-[#D49649]/50 to-[#5E2308]/90 
                       mix-blend-overlay"
            />
          </div>
        </div>

        <h1 className="relative z-2 flex justify-center text-center text-white/90 text-4xl md:text-7xl mt-[100px] mb-[60px] decoration-2 underline-offset-8">
          Programator
        </h1>

        <div className="relative z-2 flex flex-col items-center justify-center mt-20 space-y-8">
          {/* <img
            src="/assets/loading.gif"
            alt="loading"
            className="w-24 h-24 object-contain"
          /> */}

          <p className="text-2xl md:text-3xl text-white/90 mt-30 lg:mt-50 animate-pulse">
            Pagină în lucru...
          </p>
        </div>

        <div className="mt-30 md:mt-40 lg:mt-50">

        <Logo theme="light" />
        </div>
      </motion.div>
    </div>
  );
}
