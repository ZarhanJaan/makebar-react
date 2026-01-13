import { View, Text, FlatList, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function UserPage() {
  const [penjuals, setPenjuals] = useState<{ id: number; email: string }[]>([]);
  const { clearCart } = useCart();
  const router = useRouter();
  const domain = "http://212.227.166.131:11260";
  useRoleGuard("user");

  // Ambil daftar penjual dari backend
  useEffect(() => {
    const fetchPenjuals = async () => {
      try {
        const res = await fetch(`${domain}/penjuals`);
        const data = await res.json();
        setPenjuals(data);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };
    fetchPenjuals();
  }, []);

  // Function Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("role");
      clearCart();
      Alert.alert("Success", "Anda berhasil logout");
      router.replace("/login"); // arahkan ke halaman login
    } catch (err: any) {
      Alert.alert("Error", "Gagal logout: " + err.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", textAlign: "center", marginBottom: 4, marginTop: 40 }}>
        Halaman User 👤
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
        Manage your account and explore sellers
      </Text>

      {/* Tombol Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{ backgroundColor: "#ef4444", paddingVertical: 14, borderRadius: 8, marginBottom: 20 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>

      {/* Daftar Penjual */}
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginBottom: 12 }}>Daftar Penjual</Text>
      <FlatList
        data={penjuals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              padding: 14,
              borderRadius: 8,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() =>
              router.push({
                pathname: "/penjual/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
