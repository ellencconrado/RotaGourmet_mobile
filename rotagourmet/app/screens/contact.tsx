import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function ContactScreen() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
    const router = useRouter();

	const handleSend = async () => {
		if (!name || !email || !message) {
			Alert.alert("Atenção", "Preencha todos os campos.");
			return;
		}
		try {
			setSending(true);
			// TODO: integrar com Firestore/Email service
			await new Promise((r) => setTimeout(r, 800));
			Alert.alert("Enviado", "Mensagem enviada com sucesso!");
			setName("");
			setEmail("");
			setMessage("");
		} catch (e: any) {
			Alert.alert("Erro", e?.message ?? "Falha ao enviar mensagem.");
		} finally {
			setSending(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			{/* Header custom */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
					<Ionicons name="arrow-back" size={22} color="#fff" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Fale Conosco</Text>
				<TouchableOpacity onPress={() => router.push("/(tabs)/home" as any)} style={styles.headerIconBtn}>
					<Ionicons name="menu" size={22} color="#fff" />
				</TouchableOpacity>
			</View>

			<View style={styles.container}>
				<Text style={styles.label}>Adicione um comentário:</Text>
			<TextInput
				style={[styles.input, styles.textarea]}
				placeholder="Seu nome"
				value={name}
				onChangeText={setName}
			/>

				<Text style={[styles.label, { marginTop: 8 }]}>Poste uma imagem para melhor entendimento:</Text>
				<View style={styles.uploadBox}>
					<Ionicons name="image-outline" size={34} color="#C65323" />
				</View>

				<TouchableOpacity style={styles.button} disabled={sending} onPress={handleSend}>
					<Text style={styles.buttonText}>{sending ? "Enviando..." : "Enviar"}</Text>
				</TouchableOpacity>

				<Text style={styles.note}>Prazo de retorno: 7 dias úteis</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
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
	headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
	label: {
		fontSize: 12,
		fontWeight: "700",
		color: "#333",
		marginBottom: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 12,
		fontSize: 14,
		backgroundColor: "#fff",
	},
	textarea: {
		height: 120,
		textAlignVertical: "top",
	},
	uploadBox: {
		width: 90,
		height: 90,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#eee",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 3,
		elevation: 1,
		marginBottom: 14,
	},
	button: {
		backgroundColor: "#C65323",
		paddingVertical: 12,
		borderRadius: 10,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontWeight: "700",
	},
	note: {
		textAlign: "center",
		fontSize: 10,
		color: "#777",
		marginTop: 10,
	},
});


