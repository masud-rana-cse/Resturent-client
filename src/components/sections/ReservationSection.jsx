import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function ReservationSection({ onReserveClick, onContactClick }) {
  return (
    <section id="reservation" className="py-20 px-[5%] bg-white text-center">
      <div className="max-w-[800px] mx-auto">
        <h3 className="text-4xl font-extrabold text-(--secondary-500) mb-8">
          Visit Us Today
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 bg-(--neutral-50) rounded-2xl p-6 shadow-lg max-w-[600px] mx-auto mb-8">
          <div className="flex items-center gap-3">
            <FaLocationDot className="fas fa-map-marker-alt text-(--primary-500) text-xl" />
            <div className="text-left">
              <h4 className="font-bold text-(--secondary-500)">Address</h4>
              <p className="text-neutral-600 text-sm">Dhaka Mirpur 10, Dhaka</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="fas fa-phone text-(--primary-500) text-xl" />
            <div className="text-left">
              <h4 className="font-bold text-(--secondary-500)">Phone</h4>
              <p className="text-neutral-600 text-sm">01728624053</p>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onReserveClick}
            className="px-8 py-4 bg-(--primary-500)  text-white font-bold rounded-full
              hover:-translate-y-1 hover:shadow-primary-glow transition-all duration-300 border-none cursor-pointer"
          >
            Make a Reservation
          </button>
          <button
            onClick={onContactClick}
            className="px-8 py-4 border-2 border-(--primary-500) text-(--primary-500) font-bold rounded-full
              hover:bg-(--primary-500) hover:text-white hover:-translate-y-1 transition-all duration-300 bg-transparent cursor-pointer"
          >
            Send us a Message
          </button>
        </div>
      </div>
    </section>
  );
}
