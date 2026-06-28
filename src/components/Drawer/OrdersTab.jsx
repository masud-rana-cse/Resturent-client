import React from "react";

export default function OrdersTab({ cartItems, totalCartItems, cartTotal }) {
  return (
    <div className="space-y-4 rounded-2xl bg-gray-50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Cart Summary</h3>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
          {totalCartItems} items
        </span>
      </div>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500 font-semibold">Quantity: {item.quantity}</p>
            </div>
            <strong className="text-gray-800">
              ${item.quantity * item.price}
            </strong>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-semibold text-gray-600">Total</span>
        <strong className="text-lg text-gray-800">${cartTotal}</strong>
      </div>
    </div>
  );
}