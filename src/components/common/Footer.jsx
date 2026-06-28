"use client";
// src/components/layout/Footer.tsx
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook, FaX } from "react-icons/fa6";

export default function Footer() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className=" bg-(--secondary-600)">
      <div className="container mx-auto  text-white pt-16 pb-8 ">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-(--primary-500) text-xl font-bold mb-4">
              Food Court
            </h3>
            <p className="text-(--neutral-400) leading-relaxed mb-4">
              Experience the finest dining with exceptional service and
              delicious cuisine.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: FaFacebook, href: "https://www.facebook.com" },
                { icon: FaInstagram, href: "https://www.instagram.com" },
                { icon: FaX, href: "https://www.x.com" },
              ].map(({ icon, href }) => {
                const Icon = icon;
                return (
                  <a
                    key={icon}
                    target="_blank"
                    href={href}
                    className="rounded-full flex items-center justify-center text-white transition-colors duration-300"
                  >
                    <Icon className={`w-6 h-6 fab ${icon}`} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-(--primary-500) text-xl font-bold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 list-none">
              {[
                { label: "Home", id: "home" },
                { label: "Menu", id: "menu" },
                { label: "About Us", id: "about" },
                { label: "Reservations", id: "reservation" },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-(--neutral-400) hover:text-(--primary-500) transition-colors duration-300 bg-transparent border-none cursor-pointer p-0 text-base"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-(--primary-500) text-xl font-bold mb-4">
              Services
            </h3>
            <ul className="space-y-2 list-none text-(--neutral-400)">
              {["Dine-in", "Takeaway", "Delivery", "Catering"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="text-(--primary-500) text-xl font-bold mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 text-(--neutral-400)">
              <p>
                <i className="fas fa-map-marker-alt mr-2 text-(--primary-500)" />{" "}
                Dhaka Mirpur 10
              </p>
              <p>
                <i className="fas fa-phone mr-2 text-(--primary-500)" />{" "}
                01728624053
              </p>
              <p>
                <i className="fas fa-envelope mr-2 text-(--primary-500)" />{" "}
                info@foodcourt.com
              </p>
              <p>
                <i className="fas fa-clock mr-2 text-(--primary-500)" />{" "}
                Mon–Sun: 11:00 AM – 11:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-(--neutral-500) text-sm">
          © {new Date().getFullYear()} Food Court. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
