import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

type UserType = "restaurante" | "cliente" | null;

export default function RegisterTypeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserType>(null);

  function renderOption(type: Exclude<UserType, null>, label: string) {
    const isSelected = selected === type;
    return (
      <TouchableOpacity style={styles.option} onPress={() => setSelected(type)}>
        <Ionicons
          name={isSelected ? "radio-button-on" : "radio-button-off"}
          size={20}
          color="#C65323"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  function handleNext() {
    if (!selected) return;
    if (selected === "restaurante") {
      router.push("/screens/registerrestaurant");
      return;
    }
    router.push("/screens/registerclient");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma opção abaixo:</Text>
      <View style={{ height: 16 }} />
      {renderOption("restaurante", "Restaurante")}
      {renderOption("cliente", "Cliente")}
      <View style={{ height: 24 }} />
      <TouchableOpacity
        style={[styles.button, !selected && { opacity: 0.5 }]}
        disabled={!selected}
        onPress={handleNext}
      >
        <Text style={styles.buttonlabel}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    marginTop: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#C65323",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonlabel: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});


