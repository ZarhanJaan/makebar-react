import { View, Text, TextInput, Button, Alert } from "react-native";
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

      if (data.message === "User registered successfully as ") {
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
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Stack.Screen options={{ headerShown: true, headerTitle: '' }}/>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Register</Text>

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
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Register sebagai user" onPress={() => handleRegister("user")} />
      <Button title="Register sebagai penjual" onPress={() => handleRegister("penjual")} />
      <Button title="Back to Login" onPress={() => router.push("/login")} />
    </View>
  );
}