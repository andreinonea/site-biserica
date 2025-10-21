import Background from "@/components/optimized/Background";
import HeroSection from "@/components/optimized/HeroSection";
import Events from "@/components/optimized/sections/Events";
import Program from "@/components/optimized/sections/Program";

// import Program from "@/components/Program";
// import ThreeCardCarousel from "@/components/Cards";
// import Sfzi from "@/components/Sfzi";
// import Footer from "@/components/Footer";
// import Events from "@/components/Events";
// import Donate from "@/components/Donate";
// import HeroSection from "@/components/HeroSection";
// import Background from "@/components/spec/background";

export default function Home() {
  return (
    <div className="relative bg-[#C59D30] overflow-hidden">
      <Background priority />
      <section className="relative">
        <HeroSection />
      </section>

      <section className="flex flex-col gap-60 pt-20 h-[600vh]">
        <Program/>
        <Events/>
      </section>

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

