import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import ProfileDrawer from "../Drawer/ProfileDrawer";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "../../context/CartContext";

const NAV_ITEMS = [
  { label: "Home", link: "" },
  { label: "Menu", link: "menu" },
  { label: "Contact", link: "contact" },
  { label: "About Us", link: "about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();

  const favorites = [];
  const user = {};

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff8c42&color=fff`;

  const scrollTo = (id) => {
    // document
    //   .getElementById(id)
    //   ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const getLabel = (id) =>
    id === "about" ? "About Us" : `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-300
        ${scrolled ? "bg-[rgba(37,35,32,0.98)]" : "bg-[rgba(37,35,32,0.95)]"}`}
    >
      <nav className="container mx-auto  flex items-center justify-between  py-4 ">
        {/* Logo */}
        <Link
          to="/"
          className="text-base md:text-2xl font-extrabold text-(--primary-500) tracking-wide no-underline"
        >
          🍽️ Food Court
        </Link>

        {/* Desktop nav links */}
        <ul className="flex gap-8 list-none max-md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.link}>
              <NavLink
                to={item.link}
                onClick={() => scrollTo(item.link)}
                className={({ isActive }) =>
                  `font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                    isActive
                      ? "text-(--primary-600)"
                      : "text-white/90 hover:text-(--primary-500)"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center">
          {/* Icons */}
          <div className="flex justify-end items-center gap-4">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white text-xl hover:text-(--primary-500) transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Cart"
            >
              {items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--primary-500) text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {items?.length}
                </span>
              )}
              <FaShoppingCart />
            </button>

            {/* Favorites */}
            <button
              className={`relative text-xl transition-colors bg-transparent border-none cursor-pointer
              ${favorites.length > 0 ? "text-red-500" : "text-white hover:text-(--primary-500)"}`}
              aria-label="Favorites"
            >
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--primary-500) text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
              <FaHeart className="text-red-500" />
            </button>

            {/* User avatar */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 cursor-pointer bg-gray-700 md:pr-2 rounded-full border-none"
            >
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white text-sm font-medium max-[480px]:hidden">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="hidden max-md:block text-white text-xl bg-transparent border-none cursor-pointer ml-4"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden absolute top-full right-0 w-[85%] max-w-[320px] h-screen bg-[rgba(37,35,32,0.98)] py-2 transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.link}
            to={`/${item.link}`}
            onClick={() => scrollTo(item.link)}
            className={({ isActive }) =>
              `block w-full text-left px-6 py-3 bg-transparent border-none cursor-pointer font-medium transition-colors duration-200 ${
                isActive
                  ? "text-(--primary-600)"
                  : "text-white/90 hover:text-(--primary-500)"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
