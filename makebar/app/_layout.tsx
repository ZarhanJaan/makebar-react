import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import 'react-native-reanimated';

import { CartProvider } from "../context/CartContext";
import CartWindow from "../components/CartWindow";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePathname } from "expo-router";

export default function Layout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  return (
    <CartProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack initialRouteName="login">
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="pageUser" />
        <Stack.Screen name="pagePenjual" />
      </Stack>

      {/* CartWindow hanya muncul jika bukan di halaman checkout */}
      {pathname !== "/checkout" && <CartWindow />}
    </CartProvider>
  );
}