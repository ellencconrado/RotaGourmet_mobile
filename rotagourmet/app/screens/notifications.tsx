import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type AppNotification = {
	id: string;
	title: string;
	message: string;
	read?: boolean;
	createdAt: number;
};

export default function NotificationsScreen() {
	const [items, setItems] = useState<AppNotification[]>([]);

	useEffect(() => {
		// Mock: substitua por fetch do Firestore quando disponível
		setItems([
			{ id: "1", title: "Bem-vindo!", message: "Sua conta foi criada.", createdAt: Date.now() - 3600_000 },
			{ id: "2", title: "Promoção", message: "Novas ofertas disponíveis.", createdAt: Date.now() - 7200_000 },
		]);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Notificações</Text>
			{items.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons name="notifications-off-outline" size={48} color="#999" />
					<Text style={styles.subtitle}>Sem notificações no momento.</Text>
				</View>
			) : (
				<FlatList
					data={items}
					keyExtractor={(n) => n.id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={styles.cardHeader}>
								<Ionicons name={item.read ? "mail-open-outline" : "mail-outline"} size={18} color="#C65323" />
								<Text style={styles.cardTitle}>{item.title}</Text>
							</View>
							<Text style={styles.cardText}>{item.message}</Text>
						</View>
					)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 12,
		color: "#C65323",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#555",
		textAlign: "center",
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	card: {
		borderWidth: 1,
		borderColor: "#eee",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 3,
		elevation: 1,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	cardTitle: {
		fontWeight: "700",
		color: "#333",
	},
	cardText: {
		color: "#555",
		marginTop: 4,
	},
});


