import React, { useEffect, useRef } from "react";

export default function AboutSection() {
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.1 },
    );
    if (textRef.current) observer.observe(textRef.current);
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto grid grid-cols-2 gap-16 items-center max-md:grid-cols-1">
        <div ref={textRef} className="fade-in">
          <h2 className="text-4xl font-extrabold text-(--secondary-500) mb-4">
            About Our <span className="text-(--primary-500)">Restaurant</span>
          </h2>
          <p className="text-neutral-600 text-base leading-[1.8] mb-4">
            Welcome to Food Court, where culinary excellence meets exceptional
            service. Since 2020, we have been dedicated to providing our guests
            with an unforgettable dining experience.
          </p>
          <p className="text-neutral-600 text-base leading-[1.8] mb-4">
            Our passionate chefs combine traditional techniques with modern
            innovation, creating dishes that celebrate both local ingredients
            and international flavors.
          </p>
          <p className="text-neutral-600 text-base leading-[1.8]">
            From intimate dinners to special celebrations, we provide the
            perfect ambiance for any occasion.
          </p>
        </div>

        <div ref={imgRef} className="fade-in">
          <img
            src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80"
            alt="Restaurant Interior"
            width={600}
            height={400}
            className="w-full rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>
    </section>
  );
}
