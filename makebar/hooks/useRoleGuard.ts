import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export function useRoleGuard(allowedRole: string) {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem("role");
      if (role !== allowedRole) {
        // kalau role tidak sesuai, arahkan ke login
        router.replace("/login");
      }
    };
    checkRole();
  }, [allowedRole]);
}