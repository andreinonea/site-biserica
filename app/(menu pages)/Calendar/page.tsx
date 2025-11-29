"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/optimized/components/Logo";
import Background from "@/components/optimized/Background";

type LocalDay = {
  zi: number;
  zi_saptamana: string;
  sfinți: string[];
  tip?: string;
  tip_post?: string;
  post_name?: string;
  dezlegări?: string[];
};

export default function Programliturgic() {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [calendar, setCalendar] = useState<Record<string, Record<string, LocalDay>> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const localRes = await fetch("/data/calendar.json");
        const localData = await localRes.json();
        setCalendar(localData);
      } catch (err) {
        console.error("Eroare la încărcare calendar local:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [month, year]);

  const dayNames: Record<string, string> = {
    L: "luni",
    Ma: "marți",
    Mi: "miercuri",
    J: "joi",
    V: "vineri",
    S: "sâmbătă",
    D: "duminică",
  };

  const monthNames = [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie",
  ];

  const getMonthName = (monthNumber: number) => monthNames[monthNumber - 1] || "";

  const formatDate = (dateStr: string, data: LocalDay) => {
    const [_, m, d] = dateStr.split("-");
    const ziSapt = dayNames[data.zi_saptamana] || data.zi_saptamana;
    const luna = getMonthName(parseInt(m));
    return `${parseInt(d)} ${luna}, ${ziSapt}`;
  };

  const changeMonth = (offset: number) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  // detect dezlegări from both explicit array and bracket notes in sfinți text
  const extractDezlegari = (day: LocalDay) => {
    const found = {
      fish: false, // dezlegare la pește -> show fish, wine, oil icons
      harti: false, // harti -> show harti.svg
    };

    if (Array.isArray(day.dezlegări)) {
      for (const d of day.dezlegări) {
        if (!d) continue;
        const low = d.toLowerCase();
        if (low.includes("pește") || low.includes("peste") || low.includes("pește, vin") || low.includes("pește vin")) {
          found.fish = true;
        }
        if (low.includes("hart") || low.includes("harți") || low.includes("harti") || low.includes("hărți")) {
          found.harti = true;
        }
      }
    }

    if (Array.isArray(day.sfinți)) {
      const bracketRegex = /\(([^)]+)\)/gi;
      for (const s of day.sfinți) {
        if (!s) continue;
        let m;
        while ((m = bracketRegex.exec(s)) !== null) {
          const content = m[1].toLowerCase();
          if (content.includes("dezlegare la pește") || content.includes("dezlegare la peste") || content.includes("dezlegare la pește, vin și untdelemn") || content.includes("dezlegare la peste, vin și untdelemn")) {
            found.fish = true;
          }
          if (content.includes("hart") || content.includes("harți") || content.includes("harti") || content.includes("hărți")) {
            found.harti = true;
          }
        }
      }
    }

    return found;
  };

  const renderDezlegariIconsAndText = (found: { fish: boolean; harti: boolean }) => {
    const icons: { src: string; alt?: string }[] = [];
    const texts: string[] = [];

    if (found.fish) {
      icons.push({ src: "/icons/fish.svg", alt: "pește" });
      icons.push({ src: "/icons/wine.svg", alt: "vin" });
      icons.push({ src: "/icons/oil.svg", alt: "untdelemn" });
      texts.push("Dezlegare la pește, vin și untdelemn");
    }
    if (found.harti) {
      icons.push({ src: "/icons/harti.svg", alt: "harți" });
      texts.push("Harți");
    }

    if (icons.length === 0 && texts.length === 0) return null;

    return (
      <p className="mt-2 text-white/80">
        <strong className="text-[#C59D30]/80 italic mr-1">Dezlegări:</strong>
        {texts.join(", ")}{" "}
        {icons.map((ic, idx) => (
          <Image
            key={idx}
            src={ic.src}
            alt={ic.alt || ""}
            width={20}
            height={20}
            className="inline align-middle ml-1 -mt-1"
          />
        ))}
      </p>
    );
  };


  const formatFeastType = (day: LocalDay) => {

    const raw = (day.tip_post || day.tip || "").trim();
    if (!raw) return null;

    const low = raw.toLowerCase();
    if (low === "fara post" || low === "fără post" || low === "no fast") {
      return "Fără post";
    }

    if (low === "post" || low === "postul") {
      if (day.post_name && typeof day.post_name === "string" && day.post_name.trim().length > 0) {
        // ensure first letter capitalized
        return capitalizeEachWord(day.post_name);
      }
      // fallback generic
      return "Post";
    }

    // if the JSON already contains the specific name 
    // just return it capitalized properly
    return capitalizeEachWord(raw);
  };

  const capitalizeEachWord = (s: string) =>
    s
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");

  return (
    <motion.div
      initial={{ scale: 0.975, borderRadius: "30px", opacity: 0 }}
      animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
      exit={{ scale: 0.975, borderRadius: "30px", opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen bg-[#0A0004] text-white overflow-hidden"

    >
      <div className="absolute mask-b-from-0 inset-0 w-full 
        bg-[radial-gradient(circle_at_60%_20%,#ffd9a3_0%,#d79b5a_45%,#3a1a0f_100%)] 
        opacity-25 md:opacity-40">
        <div className="relative w-full h-full">

          <Background />

          {/* <Image
            className="z-2 object-cover md:hidden "
            src={"/assets/fundal-phone.png"}
            alt="program-background"
            fill
          />

          <Image
            className="z-2 object-cover hidden md:block opacity-40 "
            src={"/assets/fundal2.png"}
            alt="program-background"
            fill
          /> */}
        </div>
      </div>

      <div className="relative z-5 max-w-4xl mx-auto px-6 py-12 pt-[100px] selection:bg-yellow-600 selection:text-white/90">
        <div className="flex justify-between items-center mt-3 mb-20">
          {/* Small screens */}
          <button
            onClick={() => changeMonth(-1)}
            className="mr-1 text-[#C59D30]/60 hover:underline md:hidden"
          >
            luna anterioară ←
          </button>

          {/* Large screens */}
          <button
            onClick={() => changeMonth(-1)}
            className="mr-1 text-[#C59D30]/60 hover:underline hidden md:inline"
          >
            ← luna anterioară
          </button>
          <h1 className="text-[30px] text-center">
            Calendar {getMonthName(month)} <span className="font-[Dutch Mediaeval]">{year}</span>
          </h1>
          <button onClick={() => changeMonth(1)} className="ml-2 text-[#C59D30]/60 hover:underline">
            luna următoare →
          </button>
        </div>
        {loading && <p className="text-gray-400">Se încarcă...</p>}

        {!loading && calendar && (() => {
          const monthKey = `${year}-${String(month).padStart(2, "0")}`;
          const days = calendar[monthKey];
          if (!days) return <p className="text-gray-400">Nu există date pentru această lună.</p>;

          return Object.entries(days).map(([date, data]) => {
            const dez = extractDezlegari(data);
            const feast = formatFeastType(data);

            return (
              <div key={date} className="mb-6 border-b border-[#C59D30]/30 pb-4">
                <p className="text-lg font-[merriweather] font-semibold mb-2 text-[#C59D30]">{formatDate(date, data)}</p>

                {data.sfinți?.length > 0 && (
                  <ul className="list-none ml-4 text-white/90">
                    {data.sfinți.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Image src="/icons/trandafir (3).svg" alt="trandafir" width={16} height={16} className="mt-1" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {feast && (
                  <p className="mt-2">
                    <strong className="text-[#C59D30]/80 italic font-[merriweather]">Post:</strong>{" "}
                    <span className="text-white/80">{feast}</span>
                  </p>
                )}

                {renderDezlegariIconsAndText(dez)}
              </div>
            );
          });
        })()}

      </div>

      <Logo theme="light" />
    </motion.div >
  );
}
