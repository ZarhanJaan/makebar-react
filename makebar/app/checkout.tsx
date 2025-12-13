import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { useRouter, Stack } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from "@expo/vector-icons";

type CartItem = {
  id: number;
  menu: string;
  harga: number;
  quantity: number;
};

export default function CheckoutPage() {
  const { cart, setCart, clearCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0);

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    Alert.alert("Info", "Item berhasil dihapus dari keranjang");
  };

  const handleConfirm = () => {
    console.log("Pesanan dikonfirmasi:", cart);
    clearCart();
    router.replace("/pageUser");
    router.dismissAll();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, backgroundColor: "#f9fafb" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Tombol Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#4f46e5" />
        <Text style={{ marginLeft: 8, fontSize: 16, color: "#4f46e5", fontWeight: "600" }}>
          Back
        </Text>
      </TouchableOpacity>

      {/* Judul */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Keranjang 🛒
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Review pesananmu sebelum checkout
      </Text>

      {/* Daftar Item */}
      {cart.map((item, index) => (
        <View
          key={`${item.id}-${index}`}
          style={{
            backgroundColor: "#fff",
            padding: 14,
            borderRadius: 8,
            marginBottom: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ flex: 1, fontSize: 16, fontWeight: "500", color: "#1f2937" }}>
            {item.menu} - {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0,}).format(item.harga)}
          </Text>

          {/* Quantity Control */}
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
            <TouchableOpacity
              onPress={() => decreaseQty(item.id)}
              style={{
                backgroundColor: "#e5e7eb",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                marginRight: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>-</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => increaseQty(item.id)}
              style={{
                backgroundColor: "#e5e7eb",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                marginLeft: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Remove Item */}
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <AntDesign name="minus-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Total */}
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 20 }}>
        Total: {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0,}).format(total)}
      </Text>

      {/* Konfirmasi Pesanan */}
      <TouchableOpacity
        style={{
          backgroundColor: "#4f46e5",
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 24,
        }}
        onPress={handleConfirm}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          Konfirmasi Pesanan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
