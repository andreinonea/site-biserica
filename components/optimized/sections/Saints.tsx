"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import IconFrame from "../components/FrameButton";
import Image from "next/image";

type LocalDay = {
  zi: number;
  zi_saptamana: string;
  "sfinți": string[];
  tip: string;
  "dezlegari": string[];
};

const Sfzi = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [sfinti, setSfinti] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const target = titleRef.current;
    if (!target) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(target, { opacity: 0, y: 50 });
      gsap.to(target, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { 
          trigger: target,
          start: "top 80%",
          once: true,
        },
      });
    }, target);

    return () => ctx.revert();
  }, []);

   useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const dateKey = `${yyyy}-${mm}-${dd}`;
    const monthKey = `${yyyy}-${mm}`;

    fetch("/data/calendar.json")
      .then((res) => {
        if (!res.ok) throw new Error("Calendar JSON not found");
        return res.json();
      })
      .then((data: Record<string, Record<string, LocalDay>>) => {
        const entry = data[monthKey]?.[dateKey];
        console.log("Today's entry:", entry); // debug

        if (entry && entry.sfinți?.length > 0) {
          setSfinti(entry.sfinți);
        } else {
          setSfinti(["Niciun sfânt înregistrat azi."]);
        }
      })
      .catch((err) => {
        console.error("Eroare la încărcarea calendarului:", err);
        setSfinti(["Eroare la încărcarea calendarului."]);
      });
  }, []);

  return (
    <>
      <div className="">
        <div className="flex justify-center">
          <div className="w-full flex flex-col justify-center min-w-min">
            <section className="relative overflow-hidden w-full h-[60vh] ">
            {/* Image background section */}
              <Image
                  fill
                src="/assets/Sfinti.jpg"
                alt="Sfinti"
                className="object-cover w-full h-auto"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/65" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 space-y-6 text-center">
                <h1
                  ref={titleRef}
                  className="text-5xl sm:text-6xl md:text-8xl font-normal text-white drop-shadow-lg shadow-white"
                >
                  <span className="text-6xl sm:text-7xl md:text-9xl font-[Byzantin] text-[#c95d43]">
                    S
                  </span>
                  fintii{" "}
                  <span className="text-6xl sm:text-7xl md:text-9xl font-[Byzantin] text-[#c95d43]">
                    Z
                  </span>
                  ilei
                </h1>

                <div className="flex flex-col space-y-2 text-white text-lg sm:text-xl drop-shadow-md shadow-white">
                  {sfinti.map((nume, i) => (
                    <span key={i}>{nume}</span>
                  ))}
                </div>

                <div className="">
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
