import React, { useEffect, useRef } from "react";
import { MdEventNote, MdOutlineDining } from "react-icons/md";
import { GrDeliver } from "react-icons/gr";

const SERVICES = [
  {
    icon: MdOutlineDining,
    title: "Fine Dining",
    desc: "Experience exceptional cuisine prepared by our award-winning chefs using the finest ingredients.",
  },
  {
    icon: MdEventNote,
    title: "Special Events",
    desc: "Host your special occasions with us. We make every celebration memorable.",
  },
  {
    icon: GrDeliver,
    title: "Food Delivery",
    desc: "Enjoy our delicious meals from the comfort of your home with fast and reliable delivery.",
  },
];

export default function ServicesSection() {
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.1 },
    );
    if (titleRef.current) observer.observe(titleRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-[5%] bg-(--accent-warm)">
      <h2
        ref={titleRef}
        className="fade-in text-4xl font-extrabold text-(--secondary-500) text-center mb-2 max-[480px]:text-[1.8rem]"
      >
        Our <span className="text-(--primary-500)">Services</span>
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 max-w-[1200px] mx-auto mt-10">
        {SERVICES?.map((s, i) => {
          const Icon =s.icon
          return (
            <div
              key={s.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="fade-in text-center p-8 bg-white rounded-[20px] shadow-card hover:scale-105 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-(--primary-600) rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className={`fas ${s.icon} text-3xl text-white`} />
              </div>
              <h3 className="text-xl font-bold text-(--secondary-500) mb-3">
                {s.title}
              </h3>
              <p className="text-(--neutral-600) leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
