"use client";
import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import useDebug from "../hooks/useDebug";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection(){
      const containerRef = useRef(null);
      
      const debug = useDebug();

      const ScrollConfig = {
            trigger : containerRef.current,
            start : "top 0%", // start when box hits 80% of viewport,
            end : "bottom 100%", // end at 20%,
            scrub : true,
            markers : debug,
      }

      // useEffect(()=>{

      //       gsap.fromTo(
      //             containerRef.current,
      //             {backgroundColor : 'black'},
      //             {backgroundColor : 'blue', 
      //                   scrollTrigger : ScrollConfig
      //             },
      //       )            
      // })

      return  <div  className=" h-[200vh] scroll-smooth">
            {/* <div className="relative h-full">
                  <Image src="/assets/Sky.webp" alt="Sky" fill className="object-cover" />
            </div> */}
            <div className="container relative z-2">
                  <Image
                        src="/assets/principal.webp"
                        alt="stalpi"
                        className="object-cover object-top"
                        fill
                  />
            </div>
      </div>
}