import { useEffect, useState } from "react";

export default function useDebug() {
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    const checkDebug = () => setIsDebug(window.location.hash === "#debug");

    checkDebug(); // initial check
    window.addEventListener("hashchange", checkDebug);
    return () => window.removeEventListener("hashchange", checkDebug);
  }, []);

  return isDebug;
}
