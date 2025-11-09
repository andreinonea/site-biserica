"use client";

import { useRef, useEffect, useState, PropsWithChildren } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { easeInOutCirc } from "@/app/constants";
import IconFrame from "../components/FrameButton";

type Eveniment = {
  title: string;
  date: string;
  hour?: string;
  location?: string;
  adresa?: string;
};

const Events = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [eveniment, setEveniment] = useState<Eveniment | null>(null);

  useEffect(() => {
    const fetchEvenimente = async () => {
      try {
        const res = await fetch("/data/evenimente.json");
        const data = await res.json();

        const azi = new Date();
        azi.setHours(0, 0, 0, 0);

        // Dacă fișierul este un array:
        const viitoare = data
          .filter((ev: any) => new Date(ev.date) >= azi)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        if (viitoare.length > 0) {
          setEveniment(viitoare[0]);
        }
      } catch (err) {
        console.error("Eroare la citirea evenimentelor:", err);
      }
    };

    fetchEvenimente();
  }, []);

  return (
    <div className="relative grid place-items-center w-full pb-40 mx-auto select-none" >
      <div className="relative h-20 w-full z-2 -mt-4 mb-30 select-none ">
        <Image
          src={"/patterns/pattern0.png"}
          className="object-cover"
          alt="tipar"
          fill
        />
      </div>
      <Image
        alt="background-events"
        src={"/covers/cover1.png"}
        fill
        className="absolute object-cover z-1 mask-t-from-1 mask-b-from-0 select-none"
      />
      <div className="absolute  w-full h-full bg-[#0d111f] select-none"></div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative font-bold text-white/70 -mb-6" 
      >
        <h1 className="text-4xl lg:text-5xl leading-tight">
          <div className="relative inline-block">
            <span className="text-5xl lg:text-7xl font-[Byzantin] text-[#55302f]">E</span>
            <span className="ml-1  font-[Byzantin] text-white/80">venimente</span>
          </div>

          <div className="block sm:block md:inline-block md:ml-3 lg:ml-4 mt-2 sm:mt-1 md:mt-0 ml-25 sm:ml-20 md:ml-0">
            <span className="text-5xl lg:text-7xl  font-[Byzantin] text-[#55302f]">U</span>
            <span className="ml-2  font-[Byzantin] text-white/80">rmătoare</span>
          </div>
        </h1>


      </motion.div>

      {eveniment ? (
        <div className="relative flex items-start gap-2 mt-10 right-3">
          <div className="mt-10">
            <Image
              src="/icons/sculptura.png"
              alt="icon"
              width={40}
              height={30}
              className="mt-1"
            />
          </div>

          <div className="text-white/70 mb-16 mt-10">
            <div className="text-xl lg:text-2xl">
              {eveniment.title}
            </div>
            <div className="flex items-center gap-2 text-base">
              {eveniment.date &&
                new Intl.DateTimeFormat("ro-RO", {
                  day: "numeric",
                  month: "long",
                }).format(new Date(eveniment.date))}
              <Image
                src="/icons/dot.svg"
                alt="dot icon"
                width={24}
                height={24}
              />
              ora {eveniment.hour}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-white/50">Nu există evenimente anunțate în viitorul apropiat.</p>
      )}


      <div className="relative z-1">
        <IconFrame bgColor="bg-[#55302f]" textColor="text-white/50" >
          <Link href={"Evenimente"} className="text-base z-2 p-2 px-5">
            {"Vezi toate evenimentele"}
          </Link>
        </IconFrame>
      </div>


      <div className="relative w-full h-15 -mb-3 -bottom-40 transform translate-y-1/2 z-5">
        <Image
          src={"/patterns/top-bar.png"}
          alt="top-bar-pattern"
          className="object-cover "
          fill
        />
      </div>
    </div>
  );
};

export default Events;