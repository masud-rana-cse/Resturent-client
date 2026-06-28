import React, { useState } from "react";
import { FaTimes, FaUser, FaShoppingBag, FaHeart, FaCog } from "react-icons/fa";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import FavoritesTab from "./FavoritesTab";
import SettingsTab from "./SettingsTab";
import { useCart } from "../../context/CartContext";

export default function ProfileDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || {},
  );

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  const favoriteProducts = [
    { name: "Margherita Pizza", price: 22 },
    { name: "Grilled Steak", price: 34 },
    { name: "Chocolate Cake", price: 12 },
  ];

  const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const tabs = {
    Profile: <ProfileTab user={user} onUserUpdate={handleUserUpdate} />,
    Orders: (
      <OrdersTab
        cartItems={items}
        totalCartItems={totalCartItems}
        cartTotal={cartTotal}
      />
    ),
    Favorites: <FavoritesTab favoriteProducts={favoriteProducts} />,
    Settings: <SettingsTab />,
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-9998 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-9999 h-screen w-105 max-sm:w-full bg-white shadow-xl transform transition-transform duration-300 overflow-y-scroll hidden_scrollbar ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative flex h-60 flex-col items-center justify-center bg-linear-to-br from-orange-400 to-orange-500 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white cursor-pointer"
          >
            <FaTimes />
          </button>

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User",
            )}&background=fff&color=ff8c42`}
            alt={user?.name || "User"}
            className="h-24 w-24 rounded-full border-4 border-white"
          />

          <h2 className="mt-4 text-xl font-bold">{user?.name || "User"}</h2>
          <p>{user?.email || "No email available"}</p>
        </div>

        <div className="grid grid-cols-4 border-b">
          {[
            ["Profile", FaUser],
            ["Orders", FaShoppingBag],
            ["Favorites", FaHeart],
            ["Settings", FaCog],
          ].map(([text, Icon]) => (
            <div
              key={text}
              onClick={() => setActiveTab(text)}
              className={`flex cursor-pointer flex-col items-center py-4 transition-colors ${
                activeTab === text
                  ? "border-b-2 border-orange-500 text-primary-600"
                  : "text-gray-500 hover:text-primary-600"
              }`}
            >
              <Icon />
              <span className="mt-2 text-sm">{text}</span>
            </div>
          ))}
        </div>

        <div className="p-6">{tabs[activeTab]}</div>
      </div>
    </>
  );
}
