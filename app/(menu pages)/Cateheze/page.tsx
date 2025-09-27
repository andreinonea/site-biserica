"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Cateheza = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
};

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const waveformCache = new Map<string, Float32Array>();
let sharedAudioContext: AudioContext | null = null;

const ensureAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (sharedAudioContext) {
    return sharedAudioContext;
  }

  const AnyWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };

  const AudioCtx = window.AudioContext || AnyWindow.webkitAudioContext;

  if (!AudioCtx) {
    return null;
  }

  sharedAudioContext = new AudioCtx();
  return sharedAudioContext;
};

const extractWaveform = (buffer: AudioBuffer, buckets = 2048) => {
  const { numberOfChannels, length } = buffer;
  const channelData: Float32Array[] = [];

  for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex += 1) {
    channelData.push(buffer.getChannelData(channelIndex));
  }

  const bucketSize = Math.max(Math.floor(length / buckets), 1);
  const waveform = new Float32Array(buckets);

  for (let bucketIndex = 0; bucketIndex < buckets; bucketIndex += 1) {
    const start = bucketIndex * bucketSize;
    let accumulator = 0;

    for (let sampleIndex = 0; sampleIndex < bucketSize; sampleIndex += 1) {
      let mixed = 0;

      for (let channelIndex = 0; channelIndex < channelData.length; channelIndex += 1) {
        const channel = channelData[channelIndex];
        const dataIndex = start + sampleIndex;

        if (dataIndex < channel.length) {
          mixed += channel[dataIndex];
        }
      }

      mixed /= channelData.length || 1;
      accumulator += Math.abs(mixed);
    }

    waveform[bucketIndex] = accumulator / bucketSize;
  }

  let maxValue = 0;

  for (let index = 0; index < waveform.length; index += 1) {
    if (waveform[index] > maxValue) {
      maxValue = waveform[index];
    }
  }

  if (maxValue === 0) {
    return waveform;
  }

  for (let index = 0; index < waveform.length; index += 1) {
    waveform[index] /= maxValue;
  }

  return waveform;
};

const resampleWaveform = (source: Float32Array, targetLength: number) => {
  if (targetLength <= 0) {
    return [];
  }

  if (source.length === 0) {
    return new Array<number>(targetLength).fill(0);
  }

  const step = source.length / targetLength;
  const result = new Array<number>(targetLength);

  for (let index = 0; index < targetLength; index += 1) {
    const start = Math.floor(index * step);
    const end = Math.floor((index + 1) * step);

    let peak = 0;
    const boundedStart = Math.min(start, source.length - 1);
    const boundedEnd = Math.max(end, boundedStart + 1);

    for (let sampleIndex = boundedStart; sampleIndex < boundedEnd && sampleIndex < source.length; sampleIndex += 1) {
      if (source[sampleIndex] > peak) {
        peak = source[sampleIndex];
      }
    }

    result[index] = peak;
  }

  return result;
};

const generatePlaceholderHeights = (count: number) => {
  if (count <= 0) {
    return [];
  }

  const values: number[] = [];
  const baseFrequency = Math.PI / Math.max(count - 1, 1);

  for (let index = 0; index < count; index += 1) {
    const wave = Math.sin(baseFrequency * index) * Math.sin(baseFrequency * index * 4.7);
    values.push(28 + Math.abs(wave) * 64);
  }

  return values;
};

type CatehezaCardProps = {
  item: Cateheza;
  isActive: boolean;
  onRequestPlay: (id: number) => void;
  onRequestPause: (id: number) => void;
};

const CatehezaCard: React.FC<CatehezaCardProps> = ({
  item,
  isActive,
  onRequestPlay,
  onRequestPause,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isWaveformLoading, setIsWaveformLoading] = useState(false);
  const [rawWaveform, setRawWaveform] = useState<Float32Array | null>(null);
  const [waveformValues, setWaveformValues] = useState<number[]>([]);

  useEffect(() => {
    const element = waveformContainerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === element) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    const handleResize = () => updateWidth();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const barCount = useMemo(() => {
    if (!containerWidth) {
      return 56;
    }

    const approximate = containerWidth / 7.5;
    return Math.max(24, Math.min(180, Math.round(approximate)));
  }, [containerWidth]);

  const paddingX = useMemo(() => {
    if (!containerWidth) {
      return 16;
    }

    const proposed = containerWidth * 0.06;
    return Math.max(12, Math.min(36, proposed));
  }, [containerWidth]);

  const effectiveWidth = useMemo(() => {
    if (!containerWidth) {
      return 0;
    }

    return Math.max(containerWidth - paddingX * 2, containerWidth * 0.6);
  }, [containerWidth, paddingX]);

  const gap = useMemo(() => {
    if (!effectiveWidth) {
      return 4;
    }

    return Math.max(2, Math.min(10, effectiveWidth / Math.max(barCount * 3, 1)));
  }, [effectiveWidth, barCount]);

  const barWidth = useMemo(() => {
    if (!effectiveWidth) {
      return 3;
    }

    const available = Math.max(effectiveWidth - gap * (barCount - 1), 0);
    return Math.max(2, available / barCount);
  }, [effectiveWidth, gap, barCount]);

  useEffect(() => {
    let didCancel = false;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    const loadWaveform = async () => {
      if (!item.audioUrl || typeof window === "undefined") {
        return;
      }

      try {
        setIsWaveformLoading(true);

        let cached = waveformCache.get(item.audioUrl);

        if (!cached) {
          const response = await fetch(item.audioUrl, controller ? { signal: controller.signal } : {});

          if (!response.ok) {
            throw new Error(`Eroare la incarcarea fisierului audio (${response.status})`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const audioContext = ensureAudioContext();

          if (!audioContext) {
            throw new Error("AudioContext nu este disponibil in acest browser");
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
          cached = extractWaveform(audioBuffer);
          waveformCache.set(item.audioUrl, cached);
        }

        if (!didCancel && cached) {
          setRawWaveform(cached);
        }
      } catch (error) {
        if (!didCancel) {
          console.error("Nu pot genera forma de unda:", error);
          setRawWaveform(null);
        }
      } finally {
        if (!didCancel) {
          setIsWaveformLoading(false);
        }
      }
    };

    loadWaveform();

    return () => {
      didCancel = true;
      if (controller) {
        controller.abort();
      }
    };
  }, [item.audioUrl]);

  useEffect(() => {
    if (!rawWaveform) {
      setWaveformValues([]);
      return;
    }

    setWaveformValues(resampleWaveform(rawWaveform, barCount));
  }, [rawWaveform, barCount]);

  const displayHeights = useMemo(() => {
    if (waveformValues.length === barCount) {
      return waveformValues.map((value) => {
        const clamped = Math.min(Math.max(value, 0), 1);
        return 18 + clamped * 82;
      });
    }

    return generatePlaceholderHeights(barCount);
  }, [waveformValues, barCount]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) {
        return;
      }

      setCurrentTime(audio.currentTime);
      setProgress(Math.min(audio.currentTime / audio.duration, 1));
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      onRequestPause(item.id);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [item.id, onRequestPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!isActive && !audio.paused) {
      audio.pause();
    }
  }, [isActive]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isActive && !audio.paused) {
      audio.pause();
      onRequestPause(item.id);
      return;
    }

    onRequestPlay(item.id);

    try {
      await audio.play();
    } catch (error) {
      console.error("Nu pot reda fisierul audio:", error);
    }
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) {
      return;
    }

    const rect = waveformContainerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const adjustedWidth = Math.max(rect.width - paddingX * 2, 1);
    const relativeX = event.clientX - rect.left - paddingX;
    const ratio = Math.min(Math.max(relativeX / adjustedWidth, 0), 1);

    audio.currentTime = ratio * audio.duration;
    setCurrentTime(audio.currentTime);
    setProgress(ratio);

    if (isActive && audio.paused) {
      audio.play().catch(() => undefined);
    }
  };

  const overlayWidthStyle = useMemo(() => {
    if (!containerWidth) {
      return { width: `${progress * 100}%` };
    }

    const available = Math.max(containerWidth - paddingX * 2, 0);
    const widthPx = Math.min(containerWidth, paddingX * 2 + progress * available);
    return { width: `${widthPx}px` };
  }, [containerWidth, paddingX, progress]);

  return (
    <div
      className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1d1116] via-[#12070f] to-[#050209]/90 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-white/20"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(255, 121, 198, 0.25), transparent 55%), radial-gradient(circle at bottom right, rgba(255, 196, 112, 0.18), transparent 45%)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={`${isPlaying ? "Pauza" : "Play"} ${item.title}`}
            className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/30 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isPlaying ? "border-amber-400 bg-amber-400/20" : ""
            }`}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5.5v13a1 1 0 0 0 1.52.85l9.36-6.5a1 1 0 0 0 0-1.7l-9.36-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>

          <div>
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-1 max-w-xl text-sm text-white/70">
              {item.description}
            </p>
          </div>
        </div>

        <div className="text-right text-sm text-white/60">
          <span className="text-white">{formatTime(currentTime)}</span>
          <span className="text-white/40"> / {formatTime(duration)}</span>
        </div>
      </div>

      <div
        ref={waveformContainerRef}
        className="mt-6 h-20 cursor-pointer select-none rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm"
        onClick={handleSeek}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
      >
        <div className="relative h-full overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="flex h-full items-end"
              style={{
                gap: `${gap}px`,
                paddingLeft: `${paddingX}px`,
                paddingRight: `${paddingX}px`,
              }}
            >
              {displayHeights.map((height, index) => (
                <span
                  key={`base-${index}`}
                  className="block rounded-full bg-white/12 transition-[height] duration-300 ease-out"
                  style={{ height: `${height}%`, width: `${barWidth}px` }}
                />
              ))}
            </div>
          </div>
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={overlayWidthStyle}
          >
            <div
              className="flex h-full items-end"
              style={{
                gap: `${gap}px`,
                paddingLeft: `${paddingX}px`,
                paddingRight: `${paddingX}px`,
              }}
            >
              {displayHeights.map((height, index) => (
                <span
                  key={`active-${index}`}
                  className="block rounded-full bg-gradient-to-t from-amber-400 via-rose-300 to-indigo-200 shadow-[0_0_12px_rgba(255,200,150,0.45)] transition-[height] duration-300 ease-out"
                  style={{ height: `${height}%`, width: `${barWidth}px` }}
                />
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/70"
            style={{ mixBlendMode: "soft-light" }}
          />
          {isWaveformLoading && (
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={item.audioUrl}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
};

const CatehezePage = () => {
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

  const handleRequestPlay = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  const handleRequestPause = useCallback((id: number) => {
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  return (
    <div className="bg-[#0A0004]">
      <motion.div
        initial={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        exit={{ scale: 0.95, borderRadius: "30px", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="min-h-screen w-screen px-6 py-12 text-white relative "
      >
        <div className="absolute h-full mask-b-from-0 inset-0 isolate w-full opacity-20 z-6">
          <div className="relative h-full">
            <Image
              fill
              className="z-4 object-cover absolute mix-blend-overlay"
              alt="background"
              src={"/background/concrete_wall_003_rough_8k.jpg"}
            />
            <Image
              className="z-2 blur-md  bg-black-800 object-cover"
              src={"/assets/fundal-program.png"}
              alt="program-background"
              fill
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold flex justify-center text-white mt-[80px] mb-12">
          Cateheze
        </h1>

        {cateheze.length === 0 && <p>Nu exista date de afisat.</p>}

        {cateheze.map((item) => (
          <CatehezaCard
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onRequestPlay={handleRequestPlay}
            onRequestPause={handleRequestPause}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CatehezePage;
