import Navbar from "../components/common/Navbar";
import AboutSection from "../components/sections/AboutSection";
import Hero from "../components/sections/Hero";
import PopularDishes from "../components/sections/Menusection";
import ReservationSection from "../components/sections/ReservationSection";
import Services from "../components/sections/Services";

export default function Home() {
  return (
    <div>
      <Hero />

      <PopularDishes />

      <AboutSection />
      <Services />
      <ReservationSection />
    </div>
  );
}
