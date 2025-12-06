// "use client";

// import { ReactNode, useEffect } from "react";
// import Lenis from "lenis";

// export default function LenisProvider({ children }: { children: ReactNode }) {
//   useEffect(() => {
//     const lenis = new Lenis({
//       duration: 1.6,           // longer scroll animation → very smooth
//       lerp: 0.05,               // very heavy/smooth feeling
//       wheelMultiplier: 0.6,     // desktop scroll slower (50% speed)
//       touchMultiplier: 0.4,     // mobile scroll much slower → cinematic feel
//     });

//     function raf(time: number) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
//     requestAnimationFrame(raf);

//     return () => {};
//   }, []);

//   return <>{children}</>;
// }
