import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RegisterClientPreferencesScreen() {
  const [preference, setPreference] = useState("");
  const [alergias, setAlergias] = useState("");

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={styles.label}>
        {required ? <Text style={styles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  const valid = !!preference;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cliente:</Text>

      <Label text="Preferências gastronômicas:" />
      <View style={styles.pickerContainer}>
        <Picker selectedValue={preference} onValueChange={(v: string) => setPreference(v)}>
          <Picker.Item label="Selecione as opções..." value="" color="#777" />
          <Picker.Item label="Churrasco" value="churrasco" />
          <Picker.Item label="Frutos do Mar" value="frutos_mar" />
          <Picker.Item label="Massas" value="massas" />
          <Picker.Item label="Vegano/Vegetariano" value="veg" />
          <Picker.Item label="Doces/Sobremesas" value="doces" />
        </Picker>
      </View>

      <Label text="Observação Alérgicas:" />
      <TextInput style={styles.input} value={alergias} onChangeText={setAlergias} />

      <TouchableOpacity style={[styles.button, !valid && { opacity: 0.5 }]} disabled={!valid}>
        <Text style={styles.buttonlabel}>Próximo</Text>
      </TouchableOpacity>

      <Text style={styles.legend}><Text style={styles.required}>*</Text> Campo Obrigatório</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  required: {
    color: "#C65323",
  },
  input: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingLeft: 16,
    borderRadius: 20,
  },
  pickerContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    overflow: "hidden",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#C65323",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonlabel: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  legend: {
    alignSelf: "flex-end",
    marginTop: 12,
    fontSize: 11,
  },
});


