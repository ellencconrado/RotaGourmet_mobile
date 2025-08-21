import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { borderColor, globalStyles, inputColor } from "../styles/global";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "lib/firebase";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function showModal(message: string) {
    setModalMessage(message);
    setModalVisible(true);
  }

  const handleSend = async () => {
    const value = email.trim().toLowerCase();
    if (!value) {
      showModal("Atenção. Por favor, informe seu email.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isEmail) {
      showModal("Atenção. Digite um email válido.");
      return;
    }
    router.push("/screens/newpassword");
    try {
      setLoading(true);
      // Envia o email de redefinição de senha
      await sendPasswordResetEmail(auth, value);

      showModal(
        "Verifique seu email. Enviamos um link de redefinição de senha. Siga as instruções no email para criar uma nova senha."
      );
      router.back();
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
      showModal("Atenção" + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Text style={globalStyles.label}>Email / Telefone:</Text>
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalBackground}>
          <View style={globalStyles.modalContainer}>
            <Text style={globalStyles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={globalStyles.modalButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={{ color: "white" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 10,
  },
  codeInput: {
    width: 50,
    height: 50,
    backgroundColor: inputColor,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: borderColor,
  },
});
