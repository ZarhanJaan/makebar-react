import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";

export default function PenjualDetailPage() {
  const { id } = useLocalSearchParams(); // ambil id dari URL
  const [profil, setProfil] = useState<any>(null);
  const [menus, setMenus] = useState<{ id: number; menu: string; harga: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil profil penjual
      const resProfil = await fetch(`http://192.168.100.7:3000/penjuals/${id}`);
      const dataProfil = await resProfil.json();
      setProfil(dataProfil);

      // Ambil menu penjual
      const resMenu = await fetch(`http://192.168.100.7:3000/menus/${id}`);
      const dataMenu = await resMenu.json();
      setMenus(dataMenu);
    };
    fetchData();
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
    <Stack.Screen options={{ headerShown: false }} />
      {profil && (
        <>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>{profil.email}</Text>
        </>
      )}

      <Text style={{ fontSize: 20, marginTop: 20 }}>Menu:</Text>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>
            {item.menu} - Rp {item.harga}
          </Text>
        )}
      />
    </View>
  );
}