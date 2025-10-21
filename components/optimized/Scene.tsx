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
const CLOUD_FADE_MOBILE = 0.08;
const CLOUD_FADE_DESKTOP = 0.14;
const CLOUD_OFFSET_END_MOBILE = 0.12;
const CLOUD_OFFSET_END_DESKTOP = 0.2;
const PROGRESS_SCALE = 1.4;

const scaleProgress = (value: number) => value * PROGRESS_SCALE;

const scaleRange = (start: number, end: number): [number, number] => [
  scaleProgress(start),
  scaleProgress(end),
];

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
      return (height - viewport);
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

      const setSkyY = createSetter(sky, "y", "px");
      const setCloudY = createSetter(cloud, "y", "px");
      const setCloudOpacity = createSetter(cloud, "opacity");

      const setSaintY = createSetter(saint, "y", "px");
      const setSaintOpacity = createSetter(saint, "opacity");
      const setSaintScale = createSetter(saint, "scale");
      
      const setPrincipalScale = createSetter(principal, "scale");
      const setPrincipalOpacity = createSetter(principal, "opacity");
      const setPrincipalY = createSetter(principal, "y", "px");

      const setFalcon1X = createSetter(falcon1, "x", "px");
      const setFalcon1Opacity = createSetter(falcon1, "opacity");

      const setFalcon2X = createSetter(falcon2, "x", "px");
      const setFalcon2Opacity = createSetter(falcon2, "opacity");

      const setFalcon3X = createSetter(falcon3, "x", "px");
      const setFalcon3Opacity = createSetter(falcon3, "opacity");

      const cloudOpacityStart = scaleProgress(0.05);
      const cloudOpacityEndMobile = scaleProgress(0.05 + CLOUD_FADE_MOBILE);
      const cloudOpacityEndDesktop = scaleProgress(0.05 + CLOUD_FADE_DESKTOP);
      const cloudOpacityFadeMobile = Math.max(cloudOpacityEndMobile - cloudOpacityStart, 0.0001);
      const cloudOpacityFadeDesktop = Math.max(cloudOpacityEndDesktop - cloudOpacityStart, 0.0001);
      const cloudOffsetRangeMobile = scaleRange(0.05, CLOUD_OFFSET_END_MOBILE);
      const cloudOffsetRangeDesktop = scaleRange(0.05, CLOUD_OFFSET_END_DESKTOP);

      const [saintRangeStart, saintRangeEnd] = scaleRange(0, 1.1);

      const [principalScaleStart, principalScaleEnd] = scaleRange(0, 0.4);
      const [principalYStart, principalYEnd] = scaleRange(0.2, 1);

      const falconOneRangeMobile = scaleRange(0.2, 0.35);
      const falconOneRangeDesktop = scaleRange(0.2, 0.6);
      const falconOneOpacityPointsMobile = [
        scaleProgress(0.2),
        scaleProgress(0.22),
        scaleProgress(0.33),
        scaleProgress(0.35),
      ];
      const falconOneOpacityPointsDesktop = [
        scaleProgress(0.2),
        scaleProgress(0.28),
        scaleProgress(0.55),
        scaleProgress(0.6),
      ];

      const falconTwoRangeMobile = scaleRange(0.2, 0.4);
      const falconTwoRangeDesktop = scaleRange(0.2, 0.65);
      const falconTwoOpacityPointsMobile = [
        scaleProgress(0.2),
        scaleProgress(0.27),
        scaleProgress(0.38),
        scaleProgress(0.4),
      ];
      const falconTwoOpacityPointsDesktop = [
        scaleProgress(0.2),
        scaleProgress(0.3),
        scaleProgress(0.6),
        scaleProgress(0.65),
      ];

      const falconThreeRangeMobile = scaleRange(0.25, 0.45);
      const falconThreeRangeDesktop = scaleRange(0.25, 0.7);
      const falconThreeOpacityPointsMobile = [
        scaleProgress(0.3),
        scaleProgress(0.32),
        scaleProgress(0.43),
        scaleProgress(0.45),
      ];
      const falconThreeOpacityPointsDesktop = [
        scaleProgress(0.3),
        scaleProgress(0.35),
        scaleProgress(0.65),
        scaleProgress(0.7),
      ];


      if (cloud) {
        gsap.set(cloud, { scale: SCALE });
      }

      [falcon1, falcon2, falcon3].forEach((element) => {
        if (element) {
          gsap.set(element, { scale: SCALE });
        }
      });

      const updateScene = (progress: number) => {
        const vhUnit = window.innerHeight * 0.01;
        const vwUnit = window.innerWidth * 0.01;

        const isDesktop = window.innerWidth >= 1024;

        const cloudOpacityFade = isDesktop ? cloudOpacityFadeDesktop : cloudOpacityFadeMobile;
        const [cloudOffsetStart, cloudOffsetEnd] = isDesktop
          ? cloudOffsetRangeDesktop
          : cloudOffsetRangeMobile;

        const [falconOneRangeStart, falconOneRangeEnd] = isDesktop
          ? falconOneRangeDesktop
          : falconOneRangeMobile;
        const falconOneOpacityPoints = isDesktop
          ? falconOneOpacityPointsDesktop
          : falconOneOpacityPointsMobile;

        const [falconTwoRangeStart, falconTwoRangeEnd] = isDesktop
          ? falconTwoRangeDesktop
          : falconTwoRangeMobile;
        const falconTwoOpacityPoints = isDesktop
          ? falconTwoOpacityPointsDesktop
          : falconTwoOpacityPointsMobile;

        const [falconThreeRangeStart, falconThreeRangeEnd] = isDesktop
          ? falconThreeRangeDesktop
          : falconThreeRangeMobile;
        const falconThreeOpacityPoints = isDesktop
          ? falconThreeOpacityPointsDesktop
          : falconThreeOpacityPointsMobile;


        setSkyY(0);

        setCloudOpacity(stayOpacity(progress, cloudOpacityStart, cloudOpacityFade));
        const cloudBaseOffset = stayYOffset(
          progress,
          cloudOffsetStart,
          cloudOffsetEnd,
          10 * vhUnit
        );
        const cloudLift = isDesktop ? 28 : 14;
        setCloudY(cloudBaseOffset - cloudLift);

        setSaintScale(
          mapRangeClamped(progress, saintRangeStart, saintRangeEnd, 0.8, isDesktop ? 1.7 : 1.2)
        );
        setSaintOpacity(mapRangeClamped(progress, saintRangeStart, saintRangeEnd-.4, 0.8, 1));
        const saintYOffset =
          mapRangeClamped(progress, saintRangeStart, saintRangeEnd, 90, -21) * 16; // rem -> px
        setSaintY(saintYOffset);

        const principalLift = isDesktop ? 25 : 30;
        setPrincipalScale(mapRangeClamped(progress, principalScaleStart, principalScaleEnd, 1, 1.2));
        setPrincipalY(
          mapRangeClamped(progress, principalYStart, principalYEnd, 0, -principalLift * vhUnit)
        );

        const falconOneX = mapRangeClamped(
          progress,
          falconOneRangeStart,
          falconOneRangeEnd,
          -20 * vwUnit,
          120 * vwUnit
        );
        setFalcon1X(falconOneX);
        setFalcon1Opacity(
          segmentedOpacity(
            progress,
            falconOneOpacityPoints[0],
            falconOneOpacityPoints[1],
            falconOneOpacityPoints[2],
            falconOneOpacityPoints[3]
          )
        );

        const falconTwoX = mapRangeClamped(
          progress,
          falconTwoRangeStart,
          falconTwoRangeEnd,
          120 * vwUnit,
          -20 * vwUnit
        );
        setFalcon2X(falconTwoX);
        setFalcon2Opacity(
          segmentedOpacity(
            progress,
            falconTwoOpacityPoints[0],
            falconTwoOpacityPoints[1],
            falconTwoOpacityPoints[2],
            falconTwoOpacityPoints[3]
          )
        );

        const falconThreeX = mapRangeClamped(
          progress,
          falconThreeRangeStart,
          falconThreeRangeEnd,
          -20 * vwUnit,
          120 * vwUnit
        );
        setFalcon3X(falconThreeX);
        setFalcon3Opacity(
          segmentedOpacity(
            progress,
            falconThreeOpacityPoints[0],
            falconThreeOpacityPoints[1],
            falconThreeOpacityPoints[2],
            falconThreeOpacityPoints[3]
          )
        );

      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => "=" + computeScrollDistance(),
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
              className="absolute inset-y-0 left-1/2 z-30 flex w-full -translate-x-1/2 items-center justify-center md:hidden"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative h-full w-full ">
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
              className="absolute left-1/2 top-[18%] md:top-[17%] -translate-x-1/2 -translate-y-1/2"
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
              className="absolute left-1/2 -top-1/4 -translate-x-1/2 translate-y-1/2 z-20"
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
              className="absolute top-[26%]"
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
              className="absolute top-[30%]"
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
              className="absolute top-[35%]"
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

           
          </div>
        </div>
      </div>
    </div>
  );
}
