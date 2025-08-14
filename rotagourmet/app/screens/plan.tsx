import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

type Plan = {
	key: string;
	name: string;
	price: string;
	features: string[];
};

const PLANS: Plan[] = [
	{ key: "free", name: "Gratuito", price: "R$ 0/mês", features: ["Descobrir restaurantes", "Rotas básicas"] },
	{ key: "plus", name: "Plus", price: "R$ 19,90/mês", features: ["Favoritos ilimitados", "Rotas personalizadas", "Suporte prioritário"] },
	{ key: "pro", name: "Pro", price: "R$ 39,90/mês", features: ["Benefícios em parceiros", "Relatórios", "Experiências exclusivas"] },
];

export default function PlanScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>("plus");
    const current = useMemo(() => PLANS.find((p) => p.key === selected)!, [selected]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header custom no estilo do mock */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plano de Vínculo</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/home" as any)} style={styles.headerIconBtn}>
                    <Ionicons name="menu" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                {/* Cards do mock: Básico, Médio, Avançado */}
                {PLANS.map((plan) => (
                    <TouchableOpacity
                        key={plan.key}
                        style={[styles.mockCard, selected === plan.key && styles.mockCardActive]}
                        onPress={() => setSelected(plan.key)}
                    >
                        <View style={styles.mockCardHeader}>
                            <Ionicons name="close-outline" size={16} color="#C65323" />
                            <Text style={styles.mockCardTitle}>{plan.name}</Text>
                        </View>
                        <View style={styles.mockCardLines}>
                            <View style={styles.mockLine} />
                            <View style={styles.mockLine} />
                            <View style={[styles.mockLine, { width: "50%" }]} />
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.finishButton} onPress={() => {}}>
                    <Text style={styles.finishButtonText}>Concluir</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#C65323",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingTop: 14,
        paddingBottom: 12,
    },
    headerIconBtn: { padding: 6 },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
        gap: 14,
    },
    mockCard: {
        backgroundColor: "#f4f4f4",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    mockCardActive: {
        borderColor: "#C65323",
        backgroundColor: "#fff6f2",
    },
    mockCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    mockCardTitle: {
        fontWeight: "700",
        color: "#333",
    },
    mockCardLines: { gap: 6 },
    mockLine: {
        height: 8,
        borderRadius: 6,
        backgroundColor: "#e3e3e3",
        width: "80%",
    },
    finishButton: {
        backgroundColor: "#C65323",
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        marginTop: 6,
    },
    finishButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});


