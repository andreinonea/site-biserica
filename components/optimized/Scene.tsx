"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useDebug from "../hooks/useDebug";

gsap.registerPlugin(ScrollTrigger);

type Setter = (value: number | string) => void;

const noopSetter: Setter = () => {};

const createSetter = (
  element: Element | null | undefined,
  property: string,
  unit?: string
): Setter => {
  if (!element) {
    return noopSetter;
  }

  if (property === "scale") {
    const setScaleX = gsap.quickSetter(element, "scaleX", unit);
    const setScaleY = gsap.quickSetter(element, "scaleY", unit);
    return (value: number | string) => {
      setScaleX(value);
      setScaleY(value);
    };
  }

  return gsap.quickSetter(element, property, unit) as any;
};

const clamp01 = gsap.utils.clamp(0, 1);

const mapRangeClamped = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  if (inMax === inMin) {
    return outMin;
  }
  const ratio = clamp01((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * ratio;
};

const segmentedOpacity = (
  value: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number
) => {
  if (value <= fadeInStart) return 0;
  if (value < fadeInEnd) {
    return mapRangeClamped(value, fadeInStart, fadeInEnd, 0, 1);
  }
  if (value < fadeOutStart) return 1;
  if (value < fadeOutEnd) {
    return mapRangeClamped(value, fadeOutStart, fadeOutEnd, 1, 0);
  }
  return 0;
};

const stayOpacity = (value: number, start: number, fade: number) => {
  if (value <= start) return 0;
  if (value >= start + fade) return 1;
  return mapRangeClamped(value, start, start + fade, 0, 1);
};

const stayYOffset = (value: number, start: number, end: number, initialVh: number) => {
  if (value <= start) return initialVh;
  const midpoint = (start + end) / 2;
  if (value >= midpoint) return 0;
  return mapRangeClamped(value, start, midpoint, initialVh, 0);
};

const BG_SCROLL = -2500;
const SCALE = 1.25;
const FADE = 0.05;

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const debug = useDebug();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const computeScrollDistance = () => {
      const height = container.scrollHeight || 0;
      const viewport = window.innerHeight || 1;
      if (height <= viewport) {
        return viewport;
      }
      return height - viewport;
    };

    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(container);

      const sky = select("[data-scene='sky']")[0];
      const cloud = select("[data-scene='cloud']")[0];
      const saint = select("[data-scene='saint']")[0];
      const principal = select("[data-scene='principal']")[0];
      const falcon1 = select("[data-scene='falcon-1']")[0];
      const falcon2 = select("[data-scene='falcon-2']")[0];
      const falcon3 = select("[data-scene='falcon-3']")[0];
      const falcon4 = select("[data-scene='falcon-4']")[0];

      const setSkyY = createSetter(sky, "y", "px");
      const setCloudY = createSetter(cloud, "y", "px");
      const setCloudOpacity = createSetter(cloud, "opacity");

      const setSaintY = createSetter(saint, "y", "px");
      const setSaintOpacity = createSetter(saint, "opacity");
      const setSaintScale = createSetter(saint, "scale");

      const setPrincipalOpacity = createSetter(principal, "opacity");
      const setPrincipalY = createSetter(principal, "y", "px");

      const setFalcon1X = createSetter(falcon1, "x", "px");
      const setFalcon1Opacity = createSetter(falcon1, "opacity");

      const setFalcon2X = createSetter(falcon2, "x", "px");
      const setFalcon2Opacity = createSetter(falcon2, "opacity");

      const setFalcon3X = createSetter(falcon3, "x", "px");
      const setFalcon3Opacity = createSetter(falcon3, "opacity");

      const setFalcon4X = createSetter(falcon4, "x", "px");
      const setFalcon4Opacity = createSetter(falcon4, "opacity");

      if (cloud) {
        gsap.set(cloud, { scale: SCALE });
      }

      [falcon1, falcon2, falcon3, falcon4].forEach((element) => {
        if (element) {
          gsap.set(element, { scale: SCALE });
        }
      });

      const updateScene = (progress: number) => {
        const vhUnit = window.innerHeight * 0.01;
        const vwUnit = window.innerWidth * 0.01;

        const isDesktop = window.innerWidth >= 1024;

        setSkyY(BG_SCROLL * progress);

        setCloudOpacity(stayOpacity(progress, 0.05, FADE));
        const cloudBaseOffset = stayYOffset(progress, 0.05, 0.1, 10 * vhUnit);
        const cloudLift = isDesktop ? 28 : 14;
        setCloudY(cloudBaseOffset - cloudLift);

        setSaintScale(mapRangeClamped(progress, 0.2, 0.8, 0.8, isDesktop ? 1.4 : 1.2));
        setSaintOpacity(mapRangeClamped(progress, 0.2, 0.8, 0.6, 1));
        const saintYOffset = mapRangeClamped(progress, 0.2, 0.8, 90, -25) * 16; // rem -> px
        setSaintY(saintYOffset);

        const principalLift = isDesktop ? 26 : 18;
        setPrincipalY(mapRangeClamped(progress, 0.05, 0.32, 0, -principalLift * vhUnit));

        const falconOneX = mapRangeClamped(progress, 0.2, 0.35, -20 * vwUnit, 120 * vwUnit);
        setFalcon1X(falconOneX);
        setFalcon1Opacity(segmentedOpacity(progress, 0.2, 0.22, 0.33, 0.35));

        const falconTwoX = mapRangeClamped(progress, 0.2, 0.4, 120 * vwUnit, -20 * vwUnit);
        setFalcon2X(falconTwoX);
        setFalcon2Opacity(segmentedOpacity(progress, 0.2, 0.27, 0.38, 0.4));

        const falconThreeX = mapRangeClamped(progress, 0.25, 0.45, -20 * vwUnit, 120 * vwUnit);
        setFalcon3X(falconThreeX);
        setFalcon3Opacity(segmentedOpacity(progress, 0.3, 0.32, 0.43, 0.45));

        const falconFourX = mapRangeClamped(progress, 0.3, 0.5, 120 * vwUnit, -20 * vwUnit);
        setFalcon4X(falconFourX);
        setFalcon4Opacity(segmentedOpacity(progress, 0.35, 0.37, 0.48, 0.5));
      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => "+=" + computeScrollDistance(),
        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        markers: debug,
        onUpdate: ({ progress }) => updateScene(progress),
        onRefresh: ({ progress }) => updateScene(progress ?? 0),
      });

      updateScene(scrollTrigger.progress ?? 0);

      return () => {
        scrollTrigger.kill();
      };
    }, container);

    return () => ctx.revert();
  }, [debug]);

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] w-full overflow-visible"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black calc(100% - 250px), transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black calc(100% - 250px), transparent 100%)",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      <div className="absolute inset-0 h-[200vh] w-full">
        <div data-scene="sky" className="relative h-full">
          <Image src="/assets/Sky.webp" alt="Sky" fill className="object-cover" priority />
        </div>

        <div className="absolute inset-0 h-[200vh] w-full overflow-hidden">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0 bg-transparent" aria-hidden data-scene="background" />

            <div
              data-scene="principal"
              className="absolute inset-y-0 left-1/2 z-30 flex w-full -translate-x-1/2 items-center justify-center px-6 md:px-0"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative h-full w-full max-w-[320px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[600px]">
                <Image
                  src="/assets/principal.webp"
                  alt="Stalpi"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="cloud"
              className="absolute left-1/2 top-[17%] -translate-x-1/2 -translate-y-1/2"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[3/2] w-[120vw] max-w-[1800px] md:w-[90vw]">
                <Image
                  src="/assets/cloudR.webp"
                  alt="Cloud"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="saint"
              className="absolute left-1/2 -top-1/2 -translate-x-1/2 translate-y-1/2 z-20"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[3/4] w-[70vw] max-w-[320px] sm:w-[50vw] md:w-[30vw]">
                <Image
                  src="/assets/SfTrifon.webp"
                  alt="Sfantul Trifon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="falcon-1"
              className="absolute top-[16%]"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[16/10] w-[40vw] max-w-[520px] md:w-[22vw]">
                <Image
                  src="/assets/Falcon1.webp"
                  alt="Falcon 1"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="falcon-2"
              className="absolute top-[16%]"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[16/10] w-[40vw] max-w-[520px] md:w-[22vw]">
                <Image
                  src="/assets/Falcon2.webp"
                  alt="Falcon 2"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="falcon-3"
              className="absolute top-[25%]"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[16/10] w-[42vw] max-w-[560px] md:w-[24vw]">
                <Image
                  src="/assets/Falcon3.webp"
                  alt="Falcon 3"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              data-scene="falcon-4"
              className="absolute top-[30%]"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[16/10] w-[42vw] max-w-[560px] md:w-[24vw]">
                <Image
                  src="/assets/Falcon4.webp"
                  alt="Falcon 4"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
