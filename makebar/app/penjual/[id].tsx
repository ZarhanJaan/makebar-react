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

  useEffect(() => {
    const fetchData = async () => {
      const resProfil = await fetch(`http://192.168.100.7:3000/penjuals/${id}`);
      const dataProfil = await resProfil.json();
      setProfil(dataProfil);

      const resMenu = await fetch(`http://192.168.100.7:3000/menus/${id}`);
      const dataMenu = await resMenu.json();
      setMenus(dataMenu);
    };
    fetchData();
  }, [id]);

  const addToCart = (item: any) => {
    setCart((prev: any[]) => [...prev, { ...item, quantity: 1 }]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="blue" />
      </TouchableOpacity> */}
      <Stack.Screen options={{ headerShown: true, headerTitle: '' }}/>

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 8,
            }}
          >
            <Text>{item.menu} - Rp {item.harga}</Text>
            <TouchableOpacity onPress={() => addToCart(item)}>
              <Ionicons name="cart" size={24} color="green" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}