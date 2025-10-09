"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import SimpleCarousel from "@/components/EventCarousel";
import { motion } from "framer-motion";

type Slide = { image: string; caption?: string };

type Eveniment = {
  title: string;
  date: string;
  hour?: string;
  ora?: string;
  location?: string;
  adresa?: string;
  slides?: Slide[];
};

const EvenimentePage = () => {
  const [evenimente, setEvenimente] = useState<Eveniment[]>([]);

  useEffect(() => {
    const fetchEvenimente = async () => {
      try {
        const res = await fetch("/data/evenimente.json");
        const data: Eveniment[] = await res.json();
        setEvenimente(data);
      } catch (error) {
        console.error("Eroare la citirea fișierului JSON:", error);
      }
    };

    fetchEvenimente();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = evenimente
    .filter((ev) => new Date(ev.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = evenimente
    .filter((ev) => new Date(ev.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="text-white  min-h-screen bg-[#0A0004] ">
      <motion.div
        initial={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="min-h-screen w-full px-6 py-12 overflow-hidden"
      >
        <div className="absolute mask-b-from-0 inset-0 isolate w-full opacity-20 z-6">
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
          </div>
        </div>

        <div className="relative z-8 max-w-4xl mx-auto">
          {/* Upcoming Events */}
          <section className="mb-20 mt-25">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#C59D30] mb-8 text-center">
              Evenimente viitoare
            </h1>
            {upcoming.length === 0 ? (
              <div className="text-gray-400 text-center text-xl">
                Nu există evenimente viitoare disponibile.
              </div>
            ) : (
              <ul className="space-y-6 mt-20">
                {upcoming.map((ev, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Image
                      src="/icons/sculptura.png"
                      alt="icon"
                      width={40}
                      height={30}
                      className="mt-1"
                    />
                    <div className="flex flex-col">
                      <div className="text-lg font-semibold">{ev.title}</div>
                      <div className="text-sm text-white/70">
                        {formatDate(ev.date)} • ora {ev.ora || ev.hour || "–"}
                      </div>
                      <div className="text-sm text-white/50">
                        {ev.adresa || ev.location || "–"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Past Events */}
          <section>
            <div className="border-b border-[#C59D30]/30 pb-4 mb-20" />

            <h1 className="text-3xl md:text-4xl font-semibold text-[#C59D30] mb-20 text-center ">
              Evenimente trecute
            </h1>
            {past.length === 0 ? (
              <div className="text-gray-400 text-center text-xl">
                Nu există evenimente trecute.
              </div>
            ) : (
              <ul className="space-y-6">
                {past.map((ev, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Image
                      src="/icons/sculptura.png"
                      alt="icon"
                      width={40}
                      height={30}
                      className="mt-1"
                    />
                    <div className="flex flex-col  w-full ">
                      <div className="text-lg font-semibold">{ev.title}</div>
                      <div className="text-sm text-white/70">{formatDate(ev.date)}</div>
                      <div className="text-sm text-white/50">{ev.adresa || ev.location || "–"}</div>

                      {ev.slides && ev.slides.length > 0 && (
                        <div className="mt-6 -ml-11">
                          <SimpleCarousel slides={ev.slides} />
                        </div>
                      )}
                    </div>
                  </li>

                ))}
              </ul>
            )}
          </section>
        </div>
      </motion.div>
    </div>

  );
};

export default EvenimentePage;
