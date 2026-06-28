import { createContext, useContext } from "react";
import useCartState from "../@libs/hook/useCartState";

const CartContext = createContext();

export function CartProvider({ children }) {
  const cart = useCartState();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
