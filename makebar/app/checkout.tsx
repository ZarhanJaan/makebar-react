import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { useRouter, Stack } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

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
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
      <Stack.Screen options={{ headerShown: true, headerTitle: "" }} />

      {cart.map((item, index) => (
        <View
          key={`${item.id}-${index}`} // ✅ key unik
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
          }}
        >
          <Text style={{ flex: 1 }}>
            {item.menu} - Rp {item.harga}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", left: -10 }}>
            <TouchableOpacity
              onPress={() => decreaseQty(item.id)}
              style={{
                backgroundColor: "#ccc",
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 5,
              }}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => increaseQty(item.id)}
              style={{
                backgroundColor: "#ccc",
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginLeft: 5,
              }}
            >
              <Text>+</Text>
              </TouchableOpacity>
          </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={{left: 0}}>
              <AntDesign name="minus-circle" size={18} color="black" />
            </TouchableOpacity>
        </View>
      ))}

      <Text style={{ fontSize: 18, marginTop: 20 }}>Total: Rp {total}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 12,
          marginTop: 20,
          borderRadius: 5,
        }}
        onPress={handleConfirm}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Konfirmasi Pesanan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}