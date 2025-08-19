import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "lib/firebase"; 
import { globalStyles } from "../styles/global";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const value = email.trim().toLowerCase();
    if (!value) {
      Alert.alert("Atenção", "Por favor, informe seu email.");
      return;
    }
    // Valida o formato do email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isEmail) {
      Alert.alert("Atenção", "Digite um email válido.");
      return;
    }

    try {
      setLoading(true);
      // Envia o email de redefinição de senha
      await sendPasswordResetEmail(auth, value);


      Alert.alert(
        "Verifique seu email",
        "Enviamos um link de redefinição de senha. Siga as instruções no email para criar uma nova senha.",
        [
          {
            text: "OK",
            onPress: () => router.back(), // Volta para a tela anterior
          },
        ]
      );
    } catch (error: any) {
      // Trata os erros de envio do email
      let message = "Não foi possível enviar o email de redefinição.";
      switch (error?.code) {
        case "auth/invalid-email":
          message = "O email informado é inválido.";
          break;
        case "auth/user-not-found":
          message = "Não encontramos uma conta com esse email.";
          break;
        case "auth/too-many-requests":
          message =
            "Muitas tentativas. Tente novamente mais tarde ou verifique seu email.";
          break;
        case "auth/network-request-failed":
          message =
            "Falha de rede. Verifique sua conexão com a internet e tente novamente.";
          break;
      }
      Alert.alert("Atenção", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Text style={globalStyles.label}>Email:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <Text style={styles.instruction}>
          Enviaremos um link de redefinição para o seu email.
        </Text>

        <TouchableOpacity
          style={[globalStyles.button, loading && { opacity: 0.7 }]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonlabel}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
});