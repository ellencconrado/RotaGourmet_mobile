import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveClient } from "@/services/saveClient";
import { useRegistration } from "@/hooks/useRegistration";

import { globalStyles } from "../../styles/global";
import { globalCadStyles } from "../../styles/globalcad";

export default function RegisterFinalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userType = (params.type as string) || "client";
  const { clientBasics, clientPrefs, reset } = useRegistration();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // DEBUG: deixe true só para testar clique mesmo com campos inválidos
  const forceEnable = false;

  function showModal(message: string) {
    setModalMessage(message);
    setModalVisible(true);
  }

  function requiredValid() {
    return !!(email && password && confirmPassword && password === confirmPassword);
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validatePassword(v: string) {
    if (v.length < 6) return false;
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(v);
  }

  async function handleFinalizeRegistration() {
    // ------------- DEBUG: ver se o clique chegou aqui -------------
    console.log("[registerfinal] botão clicado", { email, required: requiredValid() });
    if (Platform.OS === "web") {
      window.alert?.("Clique no botão recebido!");
    } else {
      Alert.alert("Debug", "Clique no botão recebido!");
    }
    // --------------------------------------------------------------

    if (!forceEnable) {
      if (!validateEmail(email)) {
        showModal("Por favor, insira um email válido.");
        return;
      }
      if (!validatePassword(password)) {
        showModal(
          "A senha precisa ter no mínimo 6 caracteres e incluir letras, números e símbolos para maior segurança.",
        );
        return;
      }
      if (password !== confirmPassword) {
        showModal("As senhas não coincidem.");
        return;
      }
    }

    try {
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (__DEV__) console.log("Auth OK:", cred.user.uid);

      if (userType === "client") {
        const b = clientBasics;
        if (
          !b?.nome ||
          !b?.cpf ||
          !b?.endereco?.cep ||
          !b?.endereco?.uf ||
          !b?.endereco?.municipio
        ) {
          showModal("Complete os dados do cliente nas etapas anteriores.");
          setLoading(false);
          return;
        }

        await saveClient({
          nome: b.nome,
          telefone: b.telefone,
          cpf: b.cpf,
          cep: b.endereco.cep,
          endereco: b.endereco.logradouro,
          bairro: b.endereco.bairro,
          numero: b.endereco.numero,
          uf: b.endereco.uf,
          municipio: b.endereco.municipio,
          prefs: clientPrefs.preferencias,
          alergias: clientPrefs.alergiasObs || null,
        });
      }

      reset();
      showModal(
        `Cadastro de ${userType === "client" ? "cliente" : "restaurante"} finalizado com sucesso!`,
      );
    } catch (e: any) {
      if (__DEV__) console.error("[registerfinal] erro:", e);
      const code = e?.code || "";
      const msg =
        code === "auth/email-already-in-use"
          ? "Este e-mail já está em uso."
          : code === "permission-denied"
          ? "Permissão negada nas regras do Firestore."
          : code === "invalid-argument" || /invalid-argument/i.test(e?.message || "")
          ? "Dados inválidos para salvar no Firestore. Verifique CPF/CEP e campos obrigatórios."
          : e?.message || "Falha ao finalizar cadastro.";
      showModal(msg);
    } finally {
      setLoading(false);
    }
  }

  const getTitle = () => (userType === "client" ? "Cliente:" : "Restaurante:");

  const canPress = forceEnable || requiredValid();
  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.title}>{getTitle()}</Text>

      {/* E-mail */}
      <Text style={globalCadStyles.label}>
        <Text style={globalCadStyles.required}>* </Text>Email:
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[globalCadStyles.input, loading && { opacity: 0.6 }]}
          editable={!loading}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
      </View>

      {/* Senha */}
      <Text style={globalCadStyles.label}>
        <Text style={globalCadStyles.required}>* </Text>Senha:
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[globalCadStyles.input, loading && { opacity: 0.6 }]}
          editable={!loading}
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          returnKeyType="next"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Confirmação */}
      <Text style={globalCadStyles.label}>
        <Text style={globalCadStyles.required}>* </Text>Confirme a senha:
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[globalCadStyles.input, loading && { opacity: 0.6 }]}
          editable={!loading}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Digite a senha novamente"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.icon}
        >
          <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInfo}>
        <Text style={styles.passwordInfoText}>• A senha deve ter pelo menos 6 caracteres</Text>
        <Text style={styles.passwordInfoText}>• Use letras, números e símbolos</Text>
      </View>

      <TouchableOpacity
        style={[globalStyles.button, (!canPress || loading) && { opacity: 0.5 }]}
        disabled={!canPress || loading}
        onPress={handleFinalizeRegistration}
        accessibilityRole="button"
      >
        <Text style={globalStyles.buttonlabel}>{loading ? "Salvando..." : "Finalizar Cadastro"}</Text>
      </TouchableOpacity>

      {/* DEBUG: ver por que o botão está desabilitado */}
      <Text style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
        {`valid=${requiredValid()} | email=${!!email} | pass=${!!password} | conf=${!!confirmPassword} | match=${password === confirmPassword}`}
      </Text>

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
  inputContainer: { position: "relative", marginTop: 8 },
  icon: { position: "absolute", top: "50%", right: 20, transform: [{ translateY: -12 }] },
  passwordInfo: { marginTop: 12, marginLeft: 8 },
  passwordInfoText: { fontSize: 11, color: "#666", marginBottom: 2 },
});
