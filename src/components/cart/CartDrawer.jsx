import React from "react";
import {
  FaTimes,
  FaTrash,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  const confirmOrderFn = async () => {
    console.log("Order confirmed", items);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const res = await AxiosInstance.post("/orders/place-order", {
      userId: storedUser?._id,
      items: items,
      customer:storedUser 
    });
    console.log(res);
    if (res.data.success) {
      toast.success(res.data.message || "Order placed successfully");
      clearCart();
      onClose();
    } else {
      toast.error(res.data.message || "Failed to place order");
    }
  };
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-9998 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-105 max-sm:w-full bg-white z-9999 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <FaShoppingCart />
            Your Cart
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Items */}
        <div className="h-[calc(100vh-220px)] space-y-5 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-gray-400">
              Your cart is empty
            </p>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                {/* Product */}

                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-gray-700">{item.name}</h3>
                    <p className="font-bold text-orange-500">
                      ${item.price}.00
                    </p>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-col items-center gap-3">
                  {/* Delete top */}

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-lg text-red-500 cursor-pointer"
                  >
                    <FaTrash />
                  </button>

                  {/* Quantity bottom */}

                  <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1 shadow">
                    <button
                      onClick={() => {
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="text-gray-600 cursor-pointer"
                    >
                      <FaMinus />
                    </button>

                    <span className="text-sm font-bold">{item.quantity}</span>

                    <button
                      onClick={() => {
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="text-gray-600 cursor-pointer"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white px-8 py-6">
          <div className="mb-5 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={confirmOrderFn}
            className="w-full rounded-xl bg-(--primary-600) hover:bg-(--primary-700) py-4 font-bold text-white cursor-pointer"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </>
  );
}
