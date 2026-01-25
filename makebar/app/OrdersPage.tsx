import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OrderItem = {
  order_item_id: number;
  menu_id: number;
  menu: string;
  harga: number;
  quantity: number;
};

type Order = {
  order_id: number;
  user_id: number;
  user_email?: string; // tambahkan email user
  status: string;
  checkout_at: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useRoleGuard("penjual");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      const penjualId = await AsyncStorage.getItem("userId");
      try {
        const res = await fetch(`${API_URL}/orders/penjual/${penjualId}`);
        const data = await res.json();
        console.log("Orders data:", data); // debug
        setOrders(data);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10 }}>Memuat pesanan...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#f9fafb" }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity
        onPress={() => router.replace("/pagePenjual")}
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

      <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Pesanan Dikonfirmasi 📦
      </Text>

      {orders.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#6b7280" }}>
          Belum ada pesanan dikonfirmasi
        </Text>
      ) : (
        orders.map((order) => (
          <View
            key={order.order_id}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>
              Order #{order.order_id} - {order.user_email || `User ID ${order.user_id}`}
            </Text>
            <Text style={{ color: "#6b7280", marginBottom: 10 }}>
              Status: {order.status} | {new Date(order.checkout_at).toLocaleString("id-ID")}
            </Text>

            {Array.isArray(order.items) &&
              order.items.map((item) => (
                <View
                  key={item.order_item_id}
                  style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}
                >
                  <Text style={{ fontSize: 16 }}>
                    {item.menu} x {item.quantity}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Rp {Number(item.harga).toLocaleString("id-ID")}
                  </Text>
                </View>
              ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}