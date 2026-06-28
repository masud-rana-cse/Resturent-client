import { useState, useEffect } from "react";

const STORAGE_KEY = "restaurant_cart";

export default function useCartState() {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (dish) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === dish._id);

      if (existing) {
        return prev.map((item) =>
          item._id === dish._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,

        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);

      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,

    0,
  );

  return {
    items,

    addItem,

    removeItem,

    updateQuantity,

    clearCart,

    totalCount,

    totalPrice,
  };
}
