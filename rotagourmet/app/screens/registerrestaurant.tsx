import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterRestaurantScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [municipioUf, setMunicipioUf] = useState("");

  function requiredValid() {
    return (
      nome &&
      cnpj &&
      telefone &&
      cep &&
      endereco &&
      bairro &&
      numero &&
      municipioUf
    );
  }

  function handleNext() {
    if (!requiredValid()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (marcados com *)." );
      return;
    }
    router.push("/screens/registerrestaurantdetails");
  }

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={styles.label}>
        {required ? <Text style={styles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Restaurante:</Text>

      <Label text="Nome do estabelecimento:" required />
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="" />

      <Label text="CNPJ:" required />
      <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} placeholder="" keyboardType="number-pad" />

      <View style={styles.row}>
        <View style={styles.col}>
          <Label text="Telefone:" required />
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="" keyboardType="phone-pad" />
        </View>
        <View style={styles.gap} />
        <View style={styles.col}>
          <Label text="CEP:" required />
          <TextInput style={styles.input} value={cep} onChangeText={setCep} placeholder="" keyboardType="number-pad" />
        </View>
      </View>

      <Label text="Endereço:" required />
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="" />

      <View style={styles.row}>
        <View style={styles.col}>
          <Label text="Bairro:" required />
          <TextInput style={styles.input} value={bairro} onChangeText={setBairro} placeholder="" />
        </View>
        <View style={styles.gap} />
        <View style={styles.col}>
          <Label text="Número:" required />
          <TextInput style={styles.input} value={numero} onChangeText={setNumero} placeholder="" keyboardType="number-pad" />
        </View>
      </View>

      <Label text="Município - UF:" required />
      <TextInput style={styles.input} value={municipioUf} onChangeText={setMunicipioUf} placeholder="" />

      <TouchableOpacity style={[styles.button, !requiredValid() && { opacity: 0.5 }]} disabled={!requiredValid()} onPress={handleNext}>
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
  logoPicker: {
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: 64,
    height: 48,
    backgroundColor: "#DDD",
    borderRadius: 8,
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
  multiline: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  col: {
    flex: 1,
  },
  gap: {
    width: 12,
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


