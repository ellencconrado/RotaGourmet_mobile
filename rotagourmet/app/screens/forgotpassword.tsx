import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { borderColor, globalStyles, inputColor } from "../styles/global";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const codeRefs = useRef<TextInput[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function showModal(message: string) {
    setModalMessage(message);
    setModalVisible(true);
  }

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 4) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleSend = () => {
    if (!email.trim()) {
      showModal("Por favor, informe seu email ou telefone.");
      return;
    }

    // Verifica se o código foi preenchido
    const isCodeComplete = code.every((digit) => digit.trim() !== "");
    if (!isCodeComplete) {
      showModal("Por favor, preencha o código de confirmação completo.");
      return;
    }

    // Aqui você implementaria a verificação do código
    // Por enquanto, vamos simular que o código foi aceito
    showModal("Código verificado! Agora defina sua nova senha.");
    router.push("/screens/newpassword");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
        <Text style={globalStyles.label}>Email / Telefone:</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Digite seu email ou telefone"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.instruction}>
          Enviaremos um código de confirmação para seu email
        </Text>

        {/* Code Input Fields */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) codeRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                  codeRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleSend}>
          <Text style={globalStyles.buttonlabel}>Enviar</Text>
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
