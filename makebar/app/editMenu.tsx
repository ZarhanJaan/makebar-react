import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { useRoleGuard } from "@/hooks/useRoleGuard";


export default function editMenu() {
    const [menu, setMenu] = useState("");
    const [harga, setHarga] = useState("");
    const [items, setItems] = useState<{ id: number; menu: string; harga: string }[]>([]);
    const [editingId, seteditingId] = useState<number | null>(null);
    const router = useRouter();
    useRoleGuard("penjual");
}