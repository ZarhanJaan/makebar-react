import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = { id: number; menu: string; harga: number; quantity: number };

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}