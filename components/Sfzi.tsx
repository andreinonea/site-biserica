 "use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import IconFrame from "./gen/IconFrame";

type LocalDay = {
  zi: number;
  zi_saptamana: string;
  sfinți: string[];
  tip: string;
  dezlegări: string[];
};

const Sfzi = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sfinti, setSfinti] = useState<string[]>([]);

  // components/Sfzi.tsx
useEffect(() => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateKey = `${yyyy}-${mm}-${dd}`;

  fetch("/data/calendar.json")
    .then((res) => res.json())
    .then((data: Record<string, Record<string, LocalDay>>) => {
  const monthKey = `${yyyy}-${mm}`;
  const dateKey = `${yyyy}-${mm}-${dd}`;

  let entry: LocalDay | undefined = data[monthKey]?.[dateKey];

  if (!entry) {
    const availableDays = Object.entries(data)
      .flatMap(([, days]) =>
        Object.entries(days).map(([fullDate, value]) => ({ fullDate, value }))
      )
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

    entry = availableDays.at(-1)?.value;
  }

  setSfinti(
    entry?.sfinți?.length ? entry.sfinți : ["Nu există date pentru ziua de azi."]
  );})
    .catch(() => setSfinti(["Eroare la încărcarea calendarului."]));
}, []);


  return (
    <>
      <div className="mt-16 md:mt-20" >
        <div className="flex justify-center">
          <div className="w-full flex flex-col justify-center min-w-min">

            <section className="relative overflow-hidden">

              <img
                src="/assets/Sfinti.jpg"
                alt="Sfinti"
                className="object-cover w-full h-auto"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/65" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 space-y-6 text-center">

                <motion.h1
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-5xl sm:text-6xl md:text-8xl font-normal text-white drop-shadow-lg shadow-white">

                  <span className="text-6xl sm:text-7xl md:text-9xl font-[Byzantin] text-[#c95d43]">S</span>finții{" "}
                  <span className="text-6xl sm:text-7xl md:text-9xl font-[Byzantin] text-[#c95d43]">Z</span>ilei
                </motion.h1>

                <div className="flex flex-col space-y-2 text-white text-lg sm:text-xl drop-shadow-md shadow-white">
                  {sfinti.map((nume, i) => (
                    <span key={i}>{nume}</span>
                  ))}
                </div>

                <div className="mt-6">
                  <IconFrame bgColor="bg-[#3a2e10]" textColor="text-white/80">
                    <Link
                      href="/Calendar"
                      className="h-10 flex items-center p-4 justify-center"
                    >
                      Vezi calendarul lunii
                    </Link>
                  </IconFrame>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default Sfzi;
