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
        backgroundColor: "white",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Keranjang: {cart.length} item | Total: Rp {total}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 10,
          marginTop: 5,
          borderRadius: 5,
        }}
        onPress={() => {
          router.push("/checkout"); // arahkan ke halaman checkout
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}