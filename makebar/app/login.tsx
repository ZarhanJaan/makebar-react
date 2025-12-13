import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStatusBarHidden } from "expo-status-bar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.7:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Server error: " + text);
      }

      const data = await res.json();
      console.log("Response:", data);

      if (data.message === "Login successful") {

        // simpan id dan role ke AsyncStorage
        await AsyncStorage.setItem("userId", data.id.toString());
        await AsyncStorage.setItem("role", data.role);

        // redirect sesuai role
        if (data.role === "user") {
          router.replace("/pageUser");
          Alert.alert("Success", `Login berhasil sebagai ${email}`);
          console.log("Mengarahkan ke beranda user");
        } else if (data.role === "penjual") {
          router.replace("/pagePenjual");
          Alert.alert("Success", `Login berhasil sebagai ${email}`);
          console.log("Mengarahkan ke beranda penjual");
        } else {
          Alert.alert("Error", "Role tidak dikenal")
          console.log("Role pada akun adalah anomali, tidak dikenali")
        }
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Stack.Screen options={{ headerShown: true, headerTitle: '', headerBackVisible: false }}/>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => router.push("/register")} />
    </View>
  );
}