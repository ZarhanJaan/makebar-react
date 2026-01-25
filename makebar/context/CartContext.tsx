import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: number;           // id menu
  menu: string;         // nama menu
  harga: number;        // harga menu
  quantity: number;     // jumlah
  penjual_id: number;   // id penjual
};

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
  addToCart: (item: CartItem) => void;
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

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // cek apakah item sudah ada
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}