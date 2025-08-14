import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfileScreen() {
	const router = useRouter();
	const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
		return () => unsub();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.replace("/screens/loginscreen" as any);
		} catch (err: any) {
			Alert.alert("Erro", err?.message ?? "Não foi possível sair.");
		}
	};

	if (!currentUser) {
		return (
			<View style={styles.container}>
				<Ionicons name="person-circle-outline" size={64} color="#C65323" />
				<Text style={styles.title}>Você não está logado</Text>
				<Text style={styles.subtitle}>Entre para visualizar o seu perfil.</Text>
				<TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/screens/loginscreen" as any)}>
					<Text style={styles.primaryButtonText}>Entrar</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Ionicons name="person-circle" size={80} color="#C65323" />
			<Text style={styles.title}>{currentUser.displayName ?? "Usuário"}</Text>
			<Text style={styles.subtitle}>{currentUser.email}</Text>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert("Em breve", "Edição de perfil ainda não implementada.") }>
					<Ionicons name="create-outline" size={18} color="#C65323" />
					<Text style={styles.secondaryButtonText}>Editar Perfil</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={18} color="#fff" />
					<Text style={styles.dangerButtonText}>Sair</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		padding: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		marginTop: 8,
		marginBottom: 4,
		color: "#C65323",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#555",
		textAlign: "center",
		marginBottom: 20,
	},
	actions: {
		marginTop: 12,
		gap: 12,
		width: "80%",
	},
	primaryButton: {
		backgroundColor: "#C65323",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 10,
		marginTop: 12,
	},
	primaryButtonText: {
		color: "#fff",
		textAlign: "center",
		fontWeight: "700",
	},
	secondaryButton: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderWidth: 1.5,
		borderColor: "#C65323",
		borderRadius: 10,
	},
	secondaryButtonText: {
		color: "#C65323",
		fontWeight: "700",
	},
	dangerButton: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 10,
		backgroundColor: "#cc3a28",
	},
	dangerButtonText: {
		color: "#fff",
		fontWeight: "700",
	},
});


