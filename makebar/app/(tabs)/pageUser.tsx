import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // hapus token
      console.log("Response:", { message: "Logout successful" });
      Alert.alert("Success", "Anda sudah logout");
      router.replace("/login"); // arahkan ke login
    } catch (err: any) {
      console.error("Logout Error:", err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Selamat datang di User</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}