import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { globalStyles } from "../styles/global";
import { defaultColor } from "@/constants/Colors";

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
          color={defaultColor}
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
    <View style={[globalStyles.container, { alignItems: "flex-start" }]}>
      <View style={{ alignSelf: "center" }}>
        <Text style={[globalStyles.label, { alignSelf: "center" }]}>
          Selecione uma opção abaixo:
        </Text>
        {renderOption("restaurante", "Restaurante")}
        {renderOption("cliente", "Cliente")}
      </View>
      <TouchableOpacity
        style={[
          globalStyles.button,
          !selected && { opacity: 0.5 },
          { marginTop: 15 },
        ]}
        disabled={!selected}
        onPress={handleNext}
      >
        <Text style={globalStyles.buttonlabel}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
