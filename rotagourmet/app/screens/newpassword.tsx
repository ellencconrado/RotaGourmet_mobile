import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function NewPasswordScreen() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleConfirmPassword = () => {
        if (!newPassword.trim()) {
            Alert.alert("Atenção", "Por favor, informe a nova senha.");
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert("Atenção", "Por favor, confirme a nova senha.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem. Tente novamente.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        // Aqui você implementaria a lógica para salvar a nova senha
        Alert.alert("Sucesso", "Senha alterada com sucesso!", [
            {
                text: "OK",
                onPress: () => router.replace("/(tabs)/home" as any), // Volta para a Home
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nova Senha</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.label}>
                    <Text style={styles.required}>* </Text>
                    Nova Senha:
                </Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>
                    <Text style={styles.required}>* </Text>
                    Confirme a senha:
                </Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPassword}>
                    <Text style={styles.confirmButtonText}>Confirmar Cadastro</Text>
                </TouchableOpacity>

                {/* Required Field Indicator */}
                <View style={styles.requiredIndicator}>
                    <Text style={styles.required}>* </Text>
                    <Text style={styles.requiredText}>Campo Obrigatório</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#C65323",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 50,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    required: {
        color: "#FF0000",
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 25,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    eyeButton: {
        padding: 15,
    },
    confirmButton: {
        backgroundColor: "#C65323",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignSelf: "center",
        minWidth: 200,
        marginTop: 20,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    requiredIndicator: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: "auto",
        marginBottom: 20,
    },
    requiredText: {
        color: "#C65323",
        fontSize: 12,
        fontWeight: "500",
    },
});
