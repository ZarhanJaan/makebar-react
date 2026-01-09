import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [role, setRole] = useState("");
  const router = useRouter();

  const handleRegister = async (selectedRole: string) => {
    try {
      const res = await fetch("http://192.168.100.7:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();
      console.log("Response:", data);

      if (data.success) {
        Alert.alert("Success", `Akun berhasil dibuat sebagai ${selectedRole}`);
        router.replace("/login"); // setelah register, arahkan ke login
        console.log("Redirecting to login...")
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
        Create Account ✨
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
        Register to get started
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
          marginBottom: 20,
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={() => handleRegister("user")}
        style={{ backgroundColor: "#4f46e5", paddingVertical: 14, borderRadius: 8, marginBottom: 12 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>
          Register sebagai User
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleRegister("penjual")}
        style={{ backgroundColor: "#4f46e5", paddingVertical: 14, borderRadius: 8, marginBottom: 12 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 }}>
          Register sebagai Penjual
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 8 }}>
        <Text style={{ color: "#4f46e5", textAlign: "center", fontSize: 14 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
