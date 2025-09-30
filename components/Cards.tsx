"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";

type CardVariant = "Card1" | "Card2" | "Card3";

type Card = {
  title: string;
  desc: string;
  btnTxt: string;
  btnHref: string;
  imageSrc: string|null;
  imageAlt: string;
  variant: CardVariant;

};


const Cards: Card[] = [
  {
    title: "Istorie Biserica",
    desc:
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
    btnTxt: "Citeste mai multe",
    btnHref:
      "/About",
    imageSrc:
      "/assets/imgpictura.png",
    imageAlt: "Zzor",
    variant: "Card1",
  },
  {
    title: "Cateheze",
    desc:
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
    btnTxt: "Asculta aici",
    btnHref:
      "/Cateheze",
    imageSrc:
      "/assets/ciucuri.png",
    imageAlt: "Amón Lopez",
    variant: "Card2",
  },
  {
    title: "Card 3",
    desc:
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
    btnTxt: "Afla mai multe",
    btnHref:
      "/Contact",
    imageSrc:
      null,
    imageAlt: "Marisa",
    variant: "Card3",
  },

];

const variantClasses = {
  Card1: "h-48 sm:h-64 md:h-80 lg:h-[400px] object-contain object-cover ",
  Card2: "h-24 sm:h-[10px] md:h-[300px] object-contain object-cover",
  Card3: "lg:h-full",
};

export default function CardSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const initCardAnimation = (isTouchLayout: boolean) => {
        const cards = gsap.utils.toArray<HTMLElement>(".c-card");
        if (!cards.length) {
          return () => {};
        }

        const lastCardIndex = cards.length - 1;

        gsap.set(cards, { clearProps: "transform" });
        cards.forEach((card) => {
          gsap.set(card, { transformOrigin: "center center" });
        });

        const releasePoint = ScrollTrigger.create({
          trigger: cards[lastCardIndex],
          start: isTouchLayout ? "top top" : "center center",
        });

        const animations = cards.map((card, index) =>
          gsap.to(card, {
            scale: index === lastCardIndex ? 1 : isTouchLayout ? 0.85 : 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: isTouchLayout ? "top top+=56" : "top top+=80",
              end: () => releasePoint.start,
              pin: true,
              pinSpacing: false,
              scrub: isTouchLayout ? 0.75 : 0.5,
              pinType: ScrollTrigger.isTouch ? "transform" : "fixed",
              toggleActions: "play none none reverse",
              anticipatePin: isTouchLayout ? 2 : 1,
              invalidateOnRefresh: true,
            },
          })
        );

        ScrollTrigger.refresh();

        return () => {
          releasePoint.kill();
          animations.forEach((animation) => {
            animation.scrollTrigger?.kill();
            animation.kill();
          });
        };
      };

      mm.add("(max-width: 1023px)", () => initCardAnimation(true));
      mm.add("(min-width: 1024px)", () => initCardAnimation(false));
    }, rootRef);

    if (typeof ScrollTrigger.normalizeScroll === "function") {
      ScrollTrigger.normalizeScroll(true);
    }

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="text-white mt-40">


      <div className="l-cards mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-24">
        {Cards.map((card, index) => (
          <article
            key={card.title}
            className="c-card relative flex flex-col overflow-hidden 
             border border-[#202330] rounded-xl bg-white text-[#202330] 
             shadow-2xl shadow-black/40"
          >
            <figure className={`c-card__figure w-full relative ${variantClasses[card.variant]}`}>
              <Image
                src={(card.imageSrc || null) as any}
                alt={card.imageAlt}
                fill
                sizes="100vw"
              />
            </figure>

            {/* text section second */}
            <div className="c-card__description flex flex-col justify-center gap-6 p-10 sm:p-12 lg:p-16">
              <h2 className="c-card__title text-3xl font-semibold text-[#202330] md:text-[40px]">
                {card.title}
              </h2>
              <p className="c-card__excerpt text-base leading-relaxed text-[#202330]/80 md:text-lg">
                {card.desc}
              </p>
              <div className="c-card__cta mt-4 flex items-center gap-4">
                <Link
                  href={card.btnHref}
                  className="inline-flex items-center justify-center rounded-full 
                   border border-[#202330] px-5 py-3 text-sm text-nowrap 
                   font-semibold uppercase tracking-[0.2em] text-[#202330] 
                   transition-colors duration-200 hover:bg-[#202330] hover:text-white"
                >
                  {card.btnTxt}
                </Link>
              </div>
            </div>
          </article>

        ))}
      </div>

      <div className="relative w-full h-15 -mb-3  -bottom-15 transform translate-y-1/2 z-5">
        <Image
          src={"/patterns/top-bar.png"}
          alt="top-bar-pattern"
          className="object-cover"
          fill
        />
      </div>
    </section>
  );
}
