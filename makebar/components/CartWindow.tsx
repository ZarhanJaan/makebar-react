import { View, Text, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";
import { useRouter } from "expo-router";

type CartItem = {
  id: number;
  menu: string;
  harga: number;
  quantity: number;
};

export default function CartWindow() {
  const { cart } = useCart() as { cart: CartItem[] };
  const router = useRouter();

  const total = cart.reduce((sum: number, item: CartItem) => {
    return sum + item.harga * (item.quantity || 1);
  }, 0);

  if (cart.length === 0) return null;

  return (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      padding: 16,
      borderTopWidth: 1,
      borderColor: "#e5e7eb",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 8,
        textAlign: "center",
      }}
    >
      Keranjang: {cart.length} item | Total: {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0,}).format(total)}
    </Text>

    <TouchableOpacity
      style={{
        backgroundColor: "#4f46e5", // indigo agar selaras
        paddingVertical: 14,
        borderRadius: 8,
      }}
      onPress={() => {
        router.push("/checkout"); // arahkan ke halaman checkout
      }}
    >
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Checkout
      </Text>
    </TouchableOpacity>
  </View>
);
}
