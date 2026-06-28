import React from "react";
import { FaHeart } from "react-icons/fa";

export default function FavoritesTab({ favoriteProducts }) {
  return (
    <div className="space-y-4 rounded-2xl bg-gray-50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Favourite Products</h3>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-500">
          {favoriteProducts.length} saved
        </span>
      </div>

      <div className="space-y-3">
        {favoriteProducts.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <FaHeart />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">Saved product</p>
              </div>
            </div>
            <strong className="text-gray-800">${product.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}