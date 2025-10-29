'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { WaveSurferOptions } from "wavesurfer.js";

type Cateheza = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
};

type CatehezaCardProps = {
  item: Cateheza;
  isActive: boolean;
  onRequestPlay: (id: number) => void;
  onRequestPause: (id: number) => void;
};

const defaultWsOptions: Partial<WaveSurferOptions> = {
  waveColor: "#ffffff33",
  progressColor: "#ffcc77",
  cursorColor: "#ffffff55",
  barWidth: 2,
  barGap: 2,
  height: 80,
  normalize: true,
};

const CatehezaCard: React.FC<CatehezaCardProps> = ({
  item,
  isActive,
  onRequestPlay,
  onRequestPause,
}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null); // WaveSurfer instance
  const pendingPlayRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasRequestedLoading, setHasRequestedLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  const initializeWaveSurfer = useCallback(async () => {
    if (wavesurferRef.current || !waveformRef.current || typeof window === "undefined") {
      return wavesurferRef.current;
    }

    const WaveSurfer = (await import("wavesurfer.js")).default;

    setIsReady(false);
    setDuration(0);
    setCurrentTime(0);

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      ...defaultWsOptions,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      setHasRequestedLoading(false);

      if (pendingPlayRef.current) {
        ws.play();
        pendingPlayRef.current = false;
      }
    });

    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("timeupdate", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("finish", () => {
      setIsPlaying(false);
      onRequestPause(item.id);
      pendingPlayRef.current = false;
      ws.seekTo(0);
      setCurrentTime(0);
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => {
      setIsPlaying(false);
      pendingPlayRef.current = false;
    });

    ws.load(item.audioUrl);
    return ws;
  }, [item.audioUrl, item.id, onRequestPause]);

  // Pause if card not active
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    if (!isActive && ws.isPlaying()) ws.pause();
    if (!isActive) {
      pendingPlayRef.current = false;
      setHasRequestedLoading(false);
    }
  }, [isActive]);

  const togglePlayback = useCallback(async () => {
    const requestAutoplay = () => {
      pendingPlayRef.current = true;
      setHasRequestedLoading(true);
      onRequestPlay(item.id);
    };

    let ws = wavesurferRef.current;

    if (!ws) {
      requestAutoplay();
      const instance = await initializeWaveSurfer();
      if (!instance) {
        pendingPlayRef.current = false;
        setHasRequestedLoading(false);
        onRequestPause(item.id);
        return;
      }
      ws = instance;
      if (!isReady) return;
    } else if (!isReady) {
      requestAutoplay();
      return;
    }

    if (ws.isPlaying()) {
      ws.pause();
      onRequestPause(item.id);
    } else {
      onRequestPlay(item.id);
      ws.play();
    }
  }, [initializeWaveSurfer, isReady, item.id, onRequestPause, onRequestPlay]);

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative mb-6 rounded-xl p-6 transition-all duration-500 hover:border-white/20 overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={`${isPlaying ? "Pauza" : "Play"} ${item.title}`}
            className={`flex h-15 w-15 items-center justify-center rounded-full border border-white/13 bg-black/30 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isPlaying ? "border-amber-400 bg-amber-400/20" : ""
            }`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13a1 1 0 0 0 1.52.85l9.36-6.5a1 1 0 0 0 0-1.7l-9.36-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>
          <div>
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-1 max-w-xl text-sm text-white/70">{item.description}</p>
          </div>
        </div>

        {isActive && isReady && (
          <div className="text-right text-sm text-white/60 transition-opacity duration-300">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="text-white/40"> / {formatTime(duration)}</span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-6 h-20 w-full">
          <div ref={waveformRef} className="h-full w-full"></div>
        </div>
        {hasRequestedLoading && !isReady && (
          <p className="mt-3 text-xs text-white/70">Se încarcă cateheza...</p>
        )}
      </motion.div>
    </div>
  );
};

const CatehezePage: React.FC = () => {
  const [cateheze, setCateheze] = useState<Cateheza[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const loadCateheze = async () => {
      try {
        const res = await fetch("/data/cateheze.json");
        const data = await res.json();
        setCateheze(data);
      } catch (error) {
        console.error("Eroare la incarcarea catehezelor:", error);
      }
    };
    loadCateheze();
  }, []);

  const handleRequestPlay = useCallback((id: number) => setActiveId(id), []);
  const handleRequestPause = useCallback((id: number) => setActiveId((prev) => (prev === id ? null : prev)), []);

  return (
    <div className="bg-[#0A0004]">
      <motion.div
        initial={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="min-h-screen w-screen px-6 py-12 text-white relative"
      >
        <h1 className="text-4xl font-bold flex justify-center text-white mt-[80px] mb-12">
          Cateheze
        </h1>

        {cateheze.length === 0 && <p>Nu exista date de afisat.</p>}

        <div className="flex flex-col items-center">
          {cateheze.map((item) => (
            <div className="w-full sm:w-3/4 lg:w-2/3 border-b border-[#C59D30]/30 pb-4 mb-9" key={item.id}>
              <CatehezaCard
                item={item}
                isActive={activeId === item.id}
                onRequestPlay={handleRequestPlay}
                onRequestPause={handleRequestPause}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CatehezePage;
