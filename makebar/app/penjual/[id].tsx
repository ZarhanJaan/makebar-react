import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { StackScreen } from "react-native-screens";
import { HeaderShownContext } from "@react-navigation/elements";

export default function PenjualDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [profil, setProfil] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const { cart, setCart } = useCart();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const resProfil = await fetch(`${API_URL}/penjuals/${id}`);
      const dataProfil = await resProfil.json();
      setProfil(dataProfil);

      const resMenu = await fetch(`${API_URL}/menus/${id}`);
      const dataMenu = await resMenu.json();
      setMenus(dataMenu);
    };
    fetchData();
  }, [id]);

  const addToCart = (item: any) => {
    setCart((prev: any[]) => [...prev, { ...item, quantity: 1 }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 20 }}>
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

      {/* Profil Penjual */}
      {profil && (
        <>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {profil.email}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Menu yang tersedia dari penjual ini
          </Text>
        </>
      )}

      {/* Daftar Menu */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#374151",
          marginBottom: 12,
        }}
      >
        Menu:
      </Text>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
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
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>
              {item.menu} - {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0,}).format(item.harga)}
            </Text>
            <TouchableOpacity
              onPress={() => addToCart(item)}
              style={{
                backgroundColor: "#10b981",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Ionicons name="cart" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
