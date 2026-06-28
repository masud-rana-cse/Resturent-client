import React, { useEffect, useRef } from "react";

export default function HeroSection({ onReserveClick }) {

  function scrollToMenu() {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="home"
      className=" flex items-center px-[5%] py-30 bg-[linear-gradient(to_bottom,rgba(22,22,22,0.79),rgba(22,22,22,0.69)),url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80')] bg-center bg-cover"
    >
      <div className="container mx-auto w-full grid grid-cols-2 gap-16 items-center max-md:grid-cols-1 max-md:text-center">
        {/* Text content */}
        <div  className="fade-in">
          <div className="text-(--primary-600) font-bold text-3xl mb-4 uppercase">
            Welcome to
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 max-md:text-[2.2rem] max-[480px]:text-[1.8rem]">
            Food Court Restaurant
            <br />
            and Enjoy <span className="text-(--primary-500)">The Food</span>
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg max-md:mx-auto">
            Experience the finest dining with exceptional service and delicious
            cuisine. We are committed to providing our guests with memorable
            culinary experiences.
          </p>

          <div className="flex gap-4 flex-wrap max-md:justify-center max-md:flex-col max-md:items-center">
            <button
              onClick={onReserveClick}
              className="px-8 py-4 bg-gradient-to-br from-(--primary-500) to-primary-600 text-white font-bold rounded-full
                hover:-translate-y-1 hover:shadow-primary-glow transition-all duration-300 border-none cursor-pointer"
            >
              Reserve a Table
            </button>
            <button
              onClick={scrollToMenu}
              className="px-8 py-4 border-2 border-(--primary-500) text-(--primary-500) font-bold rounded-full
                hover:bg-(--primary-500) hover:text-white hover:-translate-y-1 transition-all duration-300 bg-transparent cursor-pointer"
            >
              Online Order
            </button>
          </div>

          <div className="mt-8 text-white/60 text-sm flex items-center gap-2 max-md:justify-center">
            <i className="fas fa-clock text-(--primary-500)" />
            Open: 08:00am – 11:00pm
          </div>
        </div>

        {/* Hero image */}
        <div className="fade-in flex justify-center max-md:hidden">
          <div className="relative  rounded-full overflow-hidden border-4 border-(--primary-500)/30 shadow-[0_0_80px_rgba(255,140,66,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
              alt="Delicious Food"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
