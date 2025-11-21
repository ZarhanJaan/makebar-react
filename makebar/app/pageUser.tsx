import { View, Text, FlatList, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function UserPage() {
  const [penjualList, setPenjualList] = useState<any[]>([]);
  const [selectedPenjual, setSelectedPenjual] = useState<any | null>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const router = useRouter();

  // Ambil daftar penjual dari backend
  useEffect(() => {
    const fetchPenjual = async () => {
      try {
        const res = await fetch("http://192.168.100.7:3000/penjuals");
        const data = await res.json();
        setPenjualList(data);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };
    fetchPenjual();
  }, []);

  // Ambil menu dari penjual tertentu
  const fetchMenus = async (penjualId: number) => {
    try {
      const res = await fetch(`http://192.168.100.7:3000/menus/${penjualId}`);
      const data = await res.json();
      setMenus(data);
      setSelectedPenjual(penjualId);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

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
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Halaman User</Text>

      {/* Tombol Logout */}
      <Button title="Logout" onPress={handleLogout} />

      {/* Daftar Penjual */}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Daftar Penjual:</Text>
      <FlatList
        data={penjualList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderBottomWidth: 1 }}
            onPress={() => fetchMenus(item.id)}
          >
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Menu dari penjual yang dipilih */}
      {selectedPenjual && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>Menu dari Penjual {selectedPenjual}:</Text>
          <FlatList
            data={menus}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ padding: 5 }}>
                {item.menu} - Rp {item.harga}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
}