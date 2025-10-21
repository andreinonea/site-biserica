"use client";
import { useEffect, useState } from "react";

type LoaderProps = {
  isLoading: boolean;
};

export default function Loader({ isLoading }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const frame = requestAnimationFrame(() => setProgress(100));

    return () => cancelAnimationFrame(frame);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-800">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${progress}%`, transition: "width 2s ease-in-out" }}
      />
    </div>
  );
}

