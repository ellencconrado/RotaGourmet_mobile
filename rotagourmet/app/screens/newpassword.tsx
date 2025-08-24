import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { globalCadStyles } from "../styles/globalcad";
import { globalStyles } from "../styles/global";
import { GenericModal } from "../components/GenericModal";
import { useModal } from "../hooks/useModal";

export default function NewPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    visible: modalVisible,
    message: modalMessage,
    showModal,
    hideModal,
  } = useModal();

  function requiredValid() {
    return confirmPassword && newPassword === confirmPassword;
  }

  function validatePassword(newPassword: string) {
    if (newPassword.length < 6) return false;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/;
    return regex.test(newPassword);
  }

  const handleConfirmPassword = () => {
    if (newPassword !== confirmPassword) {
      showModal("As senhas não coincidem. Tente novamente.");
      return;
    }

    if (!validatePassword(newPassword)) {
      showModal(
        "A senha precisa ter no mínimo 6 caracteres e incluir letras, números e símbolos para maior segurança."
      );
      return;
    }

    showModal("Senha alterada com sucesso!");
    router.push("/screens/newpassword");
  };

  return (
    <SafeAreaView style={globalCadStyles.container}>
      <View style={globalCadStyles.content}>
        <Text style={globalCadStyles.label}>
          <Text style={globalCadStyles.required}>* </Text>
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
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text style={globalCadStyles.label}>
          <Text style={globalCadStyles.required}>* </Text>
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
            style={styles.icon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, !requiredValid() && { opacity: 0.5 }]}
          disabled={!requiredValid()}
          onPress={handleConfirmPassword}
        >
          <Text style={globalStyles.buttonlabel}>Confirmar Cadastro</Text>
        </TouchableOpacity>

        {/* Required Field Indicator */}
        <View style={styles.requiredIndicator}>
          <Text style={globalCadStyles.legend}>* Campo Obrigatório</Text>
        </View>
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
  icon: {
    position: "absolute",
    top: "50%",
    right: 20,
    transform: [{ translateY: -12 }],
  },
  requiredIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "auto",
    marginBottom: 20,
  },
});
