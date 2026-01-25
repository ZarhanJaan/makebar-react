import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditMenuPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ambil id dari route param
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [menu, setMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data menu awal
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/${id}`);
        const data = await res.json();
        setMenu(data.menu);
        setHarga(data.harga.toString());
      } catch (err: any) {
        Alert.alert("Error", "Gagal mengambil data menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  const handleUpdate = async () => {
    if (!menu || !harga) {
      Alert.alert("Error", "Menu dan harga wajib diisi");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu, harga }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Menu berhasil diupdate");
        router.replace("/pagePenjual"); // kembali ke halaman penjual
      } else {
        Alert.alert("Error", data.message || "Gagal update menu");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10 }}>Memuat data menu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Tombol Back */}
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

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Edit Menu 🍽️
      </Text>

      <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Nama Menu</Text>
      <TextInput
        value={menu}
        onChangeText={setMenu}
        placeholder="Masukkan nama menu"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
      />

      <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Harga</Text>
      <TextInput
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        placeholder="Masukkan harga"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: "#4f46e5",
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>
          Simpan Perubahan
        </Text>
      </TouchableOpacity>
    </View>
  );
}