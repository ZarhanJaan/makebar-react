import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
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

      if (data.success) {

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
    <View style={{ flex: 1, backgroundColor: "#f9fafb", justifyContent: "center", padding: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", textAlign: "center", marginBottom: 4 }}>
        Welcome Back 👋
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
        Login to continue
      </Text>

      <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter your email"
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

      <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
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

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#4f46e5",
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#4f46e5", textAlign: "center", fontSize: 14 }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
