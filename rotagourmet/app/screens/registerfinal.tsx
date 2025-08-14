import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RegisterFinalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userType = params.type as string; // 'client' ou 'restaurant'

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function requiredValid() {
        return email && password && confirmPassword && password === confirmPassword;
    }

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string) {
        return password.length >= 6;
    }

    function handleFinalizeRegistration() {
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um email válido.");
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        // Aqui você pode implementar a lógica de criação da conta
        // Por exemplo, chamar uma API ou Firebase Auth
        Alert.alert(
            "Sucesso!",
            `Cadastro de ${userType === 'client' ? 'cliente' : 'restaurante'} finalizado com sucesso!`,
            [
                {
                    text: "OK",
                    onPress: () => router.push("/(tabs)/home" as any)
                }
            ]
        );
    }

    function Label({ text, required }: { text: string; required?: boolean }) {
        return (
            <Text style={styles.label}>
                {required ? <Text style={styles.required}>* </Text> : null}
                {text}
            </Text>
        );
    }

    const getTitle = () => {
        return userType === 'client' ? 'Cliente:' : 'Restaurante:';
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{getTitle()}</Text>

            <Label text="Email:" required />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                />
            </View>

            <Label text="Senha:" required />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>

            <Label text="Confirme a senha:" required />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Digite a senha novamente"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordInfo}>
                <Text style={styles.passwordInfoText}>
                    • A senha deve ter pelo menos 6 caracteres
                </Text>
                <Text style={styles.passwordInfoText}>
                    • Use letras, números e símbolos para maior segurança
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, !requiredValid() && styles.buttonDisabled]}
                disabled={!requiredValid()}
                onPress={handleFinalizeRegistration}
            >
                <Text style={styles.buttonLabel}>Finalizar Cadastro</Text>
            </TouchableOpacity>

            <Text style={styles.legend}>
                <Text style={styles.required}>*</Text> Campo Obrigatório
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        fontWeight: "bold",
        marginTop: 4,
        marginBottom: 8,
        fontSize: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 4,
    },
    required: {
        color: "#C65323",
    },
    inputContainer: {
        position: "relative",
        marginTop: 8,
    },
    input: {
        backgroundColor: "#D9D9D9",
        paddingVertical: 12,
        paddingLeft: 16,
        paddingRight: 50,
        borderRadius: 20,
        fontSize: 16,
    },
    inputIcon: {
        position: "absolute",
        right: 16,
        top: 12,
    },
    eyeIcon: {
        position: "absolute",
        right: 16,
        top: 12,
        padding: 2,
    },
    passwordInfo: {
        marginTop: 12,
        marginLeft: 8,
    },
    passwordInfoText: {
        fontSize: 11,
        color: "#666",
        marginBottom: 2,
    },
    button: {
        alignSelf: "flex-start",
        backgroundColor: "#C65323",
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
        minWidth: 200,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonLabel: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    legend: {
        alignSelf: "flex-end",
        marginTop: 12,
        fontSize: 11,
        color: "#666",
    },
});
