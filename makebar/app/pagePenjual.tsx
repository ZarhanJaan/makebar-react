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
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Judul */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          marginTop: 40,
          marginBottom: 4,
        }}
      >
        Halaman Penjual 🛒
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Kelola menu jualanmu di sini
      </Text>

      {/* Tombol Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#ef4444",
          paddingVertical: 14,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Input Nama Menu */}
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Nama Menu</Text>
      <TextInput
        value={menu}
        onChangeText={setMenu}
        placeholder="Masukkan nama menu"
        placeholderTextColor="#aaa"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
      />

      {/* Input Harga */}
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Harga</Text>
      <TextInput
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        placeholder="Masukkan harga"
        placeholderTextColor="#aaa"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "#fff",
        }}
      />

      {/* Tombol Tambah/Update Menu */}
      <TouchableOpacity
        onPress={handleAddOrUpdateMenu}
        style={{
          backgroundColor: "#4f46e5",
          paddingVertical: 14,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>
          {editingId ? "Update Menu" : "Tambah Menu"}
        </Text>
      </TouchableOpacity>

      {/* Daftar Menu */}
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginBottom: 12 }}>Daftar Menu</Text>
      <FlatList
        data={items}
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
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>
              {item.menu} - {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0,}).format(Number(item.harga))}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 12 }}>
                <Text style={{ color: "#2563eb", fontWeight: "600" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
