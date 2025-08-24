import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "lib/firebase";
import { borderColor, globalStyles, inputColor } from "../styles/global";
import { GenericModal } from "../components/GenericModal";
import { useModal } from "../hooks/useModal";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    visible: modalVisible,
    message: modalMessage,
    showModal,
    hideModal,
  } = useModal();
  const handleSend = async () => {
    const value = email.trim().toLowerCase();
    if (!value) {
      showModal("Atenção: Por favor, informe seu email.");
      return;
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isEmail) {
      showModal("Atenção: Digite um email válido.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, value);

      showModal(
        "Verifique seu email. Enviamos um link de redefinição de senha. Siga as instruções no email para criar uma nova senha.",
        () => router.back()
      );
    } catch (error: any) {
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
          message = "Falha de rede. Verifique sua conexão e tente novamente.";
          break;
      }
      showModal("Atenção: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Text style={globalStyles.label}>Email:</Text>

        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Digite seu email"
          placeholderTextColor="#9AA0A6"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          editable={!loading}
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
      <GenericModal
        visible={modalVisible}
        message={modalMessage}
        onClose={hideModal}
      />
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
  input: {
    backgroundColor: inputColor,
    borderColor,
    borderWidth: 1,
  },
});
