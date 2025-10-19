'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type LocalDay = {
  zi: number;
  zi_saptamana: string;
  sfinți: string[];
  tip: string;
  dezlegări: string[];
};

type FastInfo = {
  fast_level_desc: string;
  fast_exception_desc?: string;
};

export default function Programliturgic() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [year, setYear] = useState(today.getFullYear());

  const [calendar, setCalendar] = useState<Record<string, Record<string, LocalDay>> | null>(null);
  const [fastData, setFastData] = useState<Record<string, FastInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const localRes = await fetch('/data/calendar.json');
        const localData = await localRes.json();
        setCalendar(localData);

        const fastRes = await fetch(`https://orthocal.info/api/gregorian/${year}/${month}/`);
        const fastJson = await fastRes.json();

        const fastMap: Record<string, FastInfo> = {};
        fastJson.forEach((entry: any) => {
          const key = `${entry.year}-${String(entry.month).padStart(2, '0')}-${String(entry.day).padStart(2, '0')}`;
          fastMap[key] = {
            fast_level_desc: entry.fast_level_desc,
            fast_exception_desc: entry.fast_exception_desc
          };
        });

        setFastData(fastMap);
      } catch (error) {
        console.error('Eroare la încărcare:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [month, year]);

  const dayNames: Record<string, string> = {
    'L': 'luni',
    'Ma': 'marți',
    'Mi': 'miercuri',
    'J': 'joi',
    'V': 'vineri',
    'S': 'sâmbătă',
    'D': 'duminică'
  };

  const monthNames = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
  ];

  const fastLevelTranslations: Record<string, string> = {
    'Fast': 'Post',
    'No Fast': 'Fără post',
    'Nativity Fast': 'Postul Nașterii Domnului',
    'Lenten Fast': 'Postul Mare',
    'Dormition Fast': 'Postul Adormirii Maicii Domnului',
    'Apostles Fast': 'Postul Sfinților Apostoli'
  };

  const fastExceptionTranslations: Record<string, string> = {
    'Fast Free': 'Dezlegare la toate',
    'Fish, Wine and Oil are Allowed': 'Dezlegare la pește, vin și untdelemn',
    'Meat Fast': 'Post fără carne',
    'No overrides': 'Fără dezlegări',
    'Strict Fast': 'Post aspru',
    'Strict Fast (Wine and Oil)': 'Post aspru (dezlegare la vin și untdelemn)',
    'Wine and Oil are Allowed': 'Dezlegare la vin și untdelemn',
    'Wine is Allowed': 'Dezlegare la vin',
    'Wine, Oil and Caviar are Allowed': 'Dezlegare la vin, untdelemn și icre'
  };

  const translateFastLevel = (text?: string) =>
    text ? (fastLevelTranslations[text] ?? text) : '';

  const translateFastException = (text?: string) =>
    text ? (fastExceptionTranslations[text] ?? text) : '';

  const getMonthName = (monthNumber: number) => monthNames[monthNumber - 1] || '';

  const formatDate = (dateStr: string, data: LocalDay) => {
    const [_, m, d] = dateStr.split('-');
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

  return (
    <motion.div
      initial={{ scale: 0.98, borderRadius: '16px', opacity: 0 }}
      animate={{ scale: 1, borderRadius: '0px', opacity: 1 }}
      exit={{ scale: 0.98, borderRadius: '16px', opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0A0004] px-6 py-12 pt-[100px] text-white selection:bg-[#C59D30]"
    >
      <div className="absolute h-full mask-b-from-0 inset-0 isolate w-full opacity-20 z-1 select-none" >
        <div className="relative h-full ">
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

      <div className="relative max-w-4xl mx-auto z-1 cursor-pointer">
        <div className="flex justify-between items-center mt-3 mb-20 ">
          <button onClick={() => changeMonth(-1)} className="mr-1 text-[#C59D30]/60 hover:underline">
            luna anterioară ←
          </button>

          <h1 className="text-[30px] text-center">
            Calendar {getMonthName(month)}{" "}
            <span className="font-[Dutch Mediaeval] ">{year}</span>
          </h1>

          <button onClick={() => changeMonth(1)} className="ml-2 text-[#C59D30]/60 hover:underline">
            luna următoare →
          </button>
        </div>

        {loading && <p className="text-gray-400">Se încarcă...</p>}
        {!loading && calendar && Object.keys(calendar).length === 0 && (
          <p className="text-red-400">Eroare la încărcarea datelor.</p>
        )}

        {!loading && calendar && (() => {
          const monthKey = `${year}-${String(month).padStart(2, '0')}`;
          const days = calendar[monthKey];

          if (!days) return <p className="text-gray-400">Nu există date pentru această lună.</p>;

          return Object.entries(days).map(([date, data]) => {
            const fastInfo = fastData[date];
            const translatedFastLevel = translateFastLevel(fastInfo?.fast_level_desc);
            const translatedFastException = translateFastException(fastInfo?.fast_exception_desc);

            return (
              <div key={date} className="mb-6 border-b border-[#C59D30]/30 pb-4">
                <p className="text-lg font-semibold mb-2 text-[#C59D30] ">{formatDate(date, data)}</p>

                {data.sfinți?.length > 0 && (
                  <>
                    <p><strong className='text-[#C59D30]/80 italic'>Sfinți și sărbători:</strong></p>
                    <ul className="list-none ml-4 text-white/90">
                      {data.sfinți.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Image
                            src="/icons/trandafir (3).svg"
                            alt="trandafir"
                            width={16}
                            height={16}
                            className="mt-1"
                          />
                          <span className='text-white/80 '>{s}</span>
                        </li>
                      ))}
                    </ul>


                  </>
                )}

                {translatedFastLevel && (
                  <p className="mt-2 "><strong className='text-[#C59D30]/80 italic'>Post:</strong> <p className=" inline-block text-white/80">{translatedFastLevel}</p></p>
                )}
                {translatedFastException && (
                  <p><strong className='text-[#C59D30]/80 italic'>Dezlegări:</strong> <p className=" inline text-white/80">{translatedFastException}</p></p>
                )}
              </div>
            );
          });
        })()}
      </div>
      <div className="flex place-content-center mt-[30px]">
        <Image
          src="/footer black.png"
          className="contain mix-blend-difference"
          alt="logo"
          width={250}
          height={180}
        />
      </div>
    </motion.div>
  );
}
