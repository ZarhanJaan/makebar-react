import { View, Text, FlatList, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

export default function UserPage() {
  const [penjuals, setPenjuals] = useState<{ id: number; email: string }[]>([]);
  const router = useRouter();

  // Ambil daftar penjual dari backend
  useEffect(() => {
    const fetchPenjuals = async () => {
      try {
        const res = await fetch("http://192.168.100.7:3000/penjuals");
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
      Alert.alert("Success", "Anda berhasil logout");
      router.replace("/login"); // arahkan ke halaman login
    } catch (err: any) {
      Alert.alert("Error", "Gagal logout: " + err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Halaman User</Text>

      {/* Tombol Logout */}
      <Button title="Logout" onPress={handleLogout} />

      {/* Daftar Penjual */}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Daftar Penjual:</Text>
      <FlatList
        data={penjuals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderBottomWidth: 1 }}
            onPress={() =>
              router.push({
                pathname: "/penjual/[id]", // sesuai file app/penjual/[id].tsx
                params: { id: item.id.toString() }, // kirim id penjual
              })
            }
          >
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}