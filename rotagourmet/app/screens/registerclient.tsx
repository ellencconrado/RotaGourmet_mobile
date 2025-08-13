import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterClientScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [municipioUf, setMunicipioUf] = useState("");

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={styles.label}>
        {required ? <Text style={styles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  function requiredValid() {
    return nome && cpf && telefone && cep && endereco && bairro && numero && municipioUf;
  }

  function handleNext() {
    if (!requiredValid()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    router.push("/screens/registerclientpreferences");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cliente:</Text>

      <Label text="Nome:" required />
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Label text="CPF:" required />
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="number-pad" />

      <View style={styles.row}>
        <View style={styles.col}>
          <Label text="Telefone:" required />
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        </View>
        <View style={styles.gap} />
        <View style={styles.col}>
          <Label text="CEP:" required />
          <TextInput style={styles.input} value={cep} onChangeText={setCep} keyboardType="number-pad" />
        </View>
      </View>

      <Label text="Endereço:" required />
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} />

      <View style={styles.row}>
        <View style={styles.col}>
          <Label text="Bairro:" required />
          <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />
        </View>
        <View style={styles.gap} />
        <View style={styles.col}>
          <Label text="Número:" required />
          <TextInput style={styles.input} value={numero} onChangeText={setNumero} keyboardType="number-pad" />
        </View>
      </View>

      <Label text="Município - UF:" required />
      <TextInput style={styles.input} value={municipioUf} onChangeText={setMunicipioUf} />

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


