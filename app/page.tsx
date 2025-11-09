import Background from "@/components/optimized/Background";
import HeroSection from "@/components/optimized/HeroSection";
import Events from "@/components/optimized/sections/Events";
import Program from "@/components/optimized/sections/Program";
import Saints from '@/components/optimized/sections/Saints';
import ThreeCardCarousel from "@/components/Cards";
import DonatePage from "@/components/optimized/sections/Donate";
import Footer from "@/components/Footer";

// import Program from "@/components/Program";
// import Sfzi from "@/components/Sfzi";
// import Footer from "@/components/Footer";
// import Events from "@/components/Events";
// import Donate from "@/components/Donate";
// import HeroSection from "@/components/HeroSection";
// import Background from "@/components/spec/background";

export default function Home() {
  return (
    <div className="relative bg-[#dfb84c] overflow-hidden">
      <Background priority />
      <section className="relative">
        <HeroSection />
      </section>

      <section className="flex flex-col gap-60 pt-20 ">
        <Program/>
        <Events/>
      </section>
      <ThreeCardCarousel/>
      <Saints/>
      <DonatePage/>
      <Footer/>

      {/* <Background classname="top-[50vh] opacity-30 " /> */}
      {/* <HeroSection /> */}
      {/* <Program />
      <Events />
      <ThreeCardCarousel />
      <Sfzi  />
      <Donate />
      <Footer /> */}
    </div>
  );
}

