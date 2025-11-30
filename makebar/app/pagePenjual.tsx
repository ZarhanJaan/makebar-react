import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function PenjualPage() {
  const [menu, setMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [items, setItems] = useState<{ id: number; menu: string; harga: string }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();
  useRoleGuard("penjual");

  // Ambil daftar menu dari backend saat halaman dibuka
  useEffect(() => {
    const fetchMenus = async () => {
      const penjualId = await AsyncStorage.getItem("userId");
      if (!penjualId) {
        Alert.alert("Error", "ID penjual tidak ditemukan, silakan login ulang");
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`http://192.168.100.7:3000/menus/${penjualId}`);
        const data = await res.json();
        setItems(data);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };

    fetchMenus();
  }, []);

  const handleAddOrUpdateMenu = async () => {
    if (!menu || !harga) {
      Alert.alert("Error", "Menu dan harga wajib diisi");
      return;
    }

    try {
      const penjualId = await AsyncStorage.getItem("userId");
      if (!penjualId) {
        Alert.alert("Error", "ID penjual tidak ditemukan, silakan login ulang");
        return;
      }

      if (editingId) {
        // Update menu
        const res = await fetch(`http://192.168.100.7:3000/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menu, harga }),
        });
        const data = await res.json();
        if (data.message.includes("berhasil")) {
          Alert.alert("Success", "Menu berhasil diupdate!");
          const refresh = await fetch(`http://192.168.100.7:3000/menus/${penjualId}`);
          const newData = await refresh.json();
          setItems(newData);
          setMenu("");
          setHarga("");
          setEditingId(null);
        } else {
          Alert.alert("Error", data.message);
        }
      } else {
        // Tambah menu baru
        const res = await fetch("http://192.168.100.7:3000/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menu, harga, penjual_id: penjualId }),
        });
        const data = await res.json();
        if (data.message.includes("berhasil")) {
          Alert.alert("Success", "Menu berhasil ditambahkan!");
          const refresh = await fetch(`http://192.168.100.7:3000/menus/${penjualId}`);
          const newData = await refresh.json();
          setItems(newData);
          setMenu("");
          setHarga("");
        } else {
          Alert.alert("Error", data.message);
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleEdit = (item: { id: number; menu: string; harga: string }) => {
    setMenu(item.menu);
    setHarga(item.harga.toString());
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://192.168.100.7:3000/menu/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.message.includes("berhasil")) {
        Alert.alert("Success", "Menu berhasil dihapus!");
        setItems(items.filter((item) => item.id !== id));
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("role");
    Alert.alert("Success", "Anda berhasil logout");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ headerShown: true, headerTitle: "" }} />
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Halaman Penjual</Text>

      <Button title="Logout" onPress={handleLogout} />

      <Text>Nama Menu</Text>
      <TextInput
        value={menu}
        onChangeText={setMenu}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Harga</Text>
      <TextInput
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button
        title={editingId ? "Update Menu" : "Tambah Menu"}
        onPress={handleAddOrUpdateMenu}
      />

      <Text style={{ marginTop: 30, fontSize: 18 }}>Daftar Menu:</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
            <Text>
              {item.menu} - Rp {item.harga}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                <Text style={{ color: "blue" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "red" }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}