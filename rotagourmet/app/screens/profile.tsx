import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useModal } from "../hooks/useModal";
import { GenericModal } from "../components/GenericModal";
import { defaultColor, globalStyles } from "../styles/global";
import { useRegistration } from "@/hooks/useRegistration";

export default function ProfileScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const { setIsEditMode } = useRegistration();
  const {
    visible: modalVisible,
    message: modalMessage,
    showModal,
    hideModal,
  } = useModal();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/screens/loginscreen" as any);
    } catch (err: any) {
      showModal(`Erro: ${err?.message ?? ""} - Não foi possível sair.`);
    }
  };

  if (!currentUser) {
    return (
      <View style={globalStyles.container}>
        <Ionicons name="person-circle-outline" size={64} color={defaultColor} />
        <Text
          style={[globalStyles.title, { color: defaultColor, fontSize: 22 }]}
        >
          Você não está logado
        </Text>
        <Text style={styles.subtitle}>Entre para visualizar o seu perfil.</Text>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => router.push("/screens/loginscreen" as any)}
        >
          <Text style={globalStyles.buttonlabel}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={globalStyles.container}>
      <Ionicons name="person-circle" size={80} color={defaultColor} />
      <Text style={globalStyles.title}>
        {currentUser.displayName ?? "Usuário"}
      </Text>
      <Text style={styles.subtitle}>{currentUser.email}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setIsEditMode(true);
            router.push("/screens/registerclient");
          }}
        >
          <Ionicons name="create-outline" size={18} color={defaultColor} />
          <Text style={styles.secondaryButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            router.push({
              pathname: "/screens/registerfinal",
              params: { mode: "edit" },
            })
          }
        >
          <Ionicons name="create-outline" size={18} color={defaultColor} />
          <Text style={styles.secondaryButtonText}>Editar Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            showModal("Em breve. Minha avaliações ainda não implementada.")
          }
        >
          <Ionicons name="create-outline" size={18} color={defaultColor} />
          <Text style={styles.secondaryButtonText}>Minhas Avaliações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text style={styles.dangerButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <GenericModal
        visible={modalVisible}
        message={modalMessage}
        onClose={hideModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 0,
  },
  actions: {
    marginTop: 12,
    gap: 12,
    width: "80%",
  },
  secondaryButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: defaultColor,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: defaultColor,
    fontWeight: "700",
  },
  dangerButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: defaultColor,
  },
  dangerButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
