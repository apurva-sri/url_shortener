import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import LaptopShowcase from "../../components/landing/LaptopShowcase";
import Marquee from "../../components/landing/Marquee";

function Landing() {
  return (
    <>
      <Navbar />

      <Hero />

      <LaptopShowcase />

      <Marquee />
    </>
  );
}

export default Landing;
