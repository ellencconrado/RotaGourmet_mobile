import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "../styles/global";
import { globalCadStyles } from "../styles/globalcad";

export default function RegisterFinalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userType = params.type as string; // 'client' ou 'restaurant'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function showModal(message: string) {
    setModalMessage(message);
    setModalVisible(true);
  }

  function requiredValid() {
    return email && password && confirmPassword && password === confirmPassword;
  }

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password: string) {
    if (password.length < 6) return false;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/;
    return regex.test(password);
  }

  function handleFinalizeRegistration() {
    if (!validateEmail(email)) {
      showModal("Por favor, insira um email válido.");
      return;
    }

    if (!validatePassword(password)) {
      showModal(
        "A senha precisa ter no mínimo 6 caracteres e incluir letras, números e símbolos para maior segurança."
      );
      return;
    }
    if (password !== confirmPassword) {
      showModal("As senhas não coincidem.");
      return;
    }
    showModal(
      `Cadastro de ${
        userType === "client" ? "cliente" : "restaurante"
      } finalizado com sucesso!`
    );
  }

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={globalCadStyles.label}>
        {required ? <Text style={globalCadStyles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  const getTitle = () => {
    return userType === "client" ? "Cliente:" : "Restaurante:";
  };

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>{getTitle()}</Text>

      <Label text="Email:" required />
      <View style={styles.inputContainer}>
        <TextInput
          style={globalCadStyles.input}
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
          style={styles.icon}
        />
      </View>

      <Label text="Senha:" required />
      <View style={styles.inputContainer}>
        <TextInput
          style={globalCadStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.icon}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <Label text="Confirme a senha:" required />
      <View style={styles.inputContainer}>
        <TextInput
          style={globalCadStyles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Digite a senha novamente"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.icon}
        >
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={24}
            color="#888"
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
        style={[globalStyles.button, !requiredValid() && { opacity: 0.5 }]}
        disabled={!requiredValid()}
        onPress={handleFinalizeRegistration}
      >
        <Text style={globalStyles.buttonlabel}>Finalizar Cadastro</Text>
      </TouchableOpacity>

      <Text style={globalCadStyles.legend}>* Campo Obrigatório</Text>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalCadStyles.modalBackground}>
          <View style={globalCadStyles.modalContainer}>
            <Text style={globalCadStyles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={globalCadStyles.modalButton}
              onPress={() => {
                setModalVisible(false);
                // Redireciona para home se mensagem for de sucesso
                if (modalMessage.includes("finalizado com sucesso")) {
                  router.push("/(tabs)/home");
                }
              }}
            >
              <Text style={{ color: "white" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    marginTop: 8,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  icon: {
    position: "absolute",
    top: "50%",
    right: 20,
    transform: [{ translateY: -12 }],
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
});
