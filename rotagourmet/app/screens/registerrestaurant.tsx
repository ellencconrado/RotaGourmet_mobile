import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../../styles/global";
import { Picker } from "@react-native-picker/picker";
import { globalCadStyles } from "../../styles/globalcad";

export default function RegisterRestaurantScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");

  const [estados, setEstados] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");

  // Carrega estados ao iniciar
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => {
        // ordena por nome
        const ordenados = data.sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(ordenados);
      });
  }, []);

  // Carrega municípios quando um estado for selecionado
  useEffect(() => {
    if (estadoSelecionado) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
      )
        .then((res) => res.json())
        .then((data) => {
          const ordenados = data.sort((a: any, b: any) =>
            a.nome.localeCompare(b.nome)
          );
          setMunicipios(ordenados);
        });
    }
  }, [estadoSelecionado]);

  function requiredValid() {
    return (
      nome &&
      cnpj &&
      telefone &&
      cep &&
      endereco &&
      bairro &&
      numero &&
      estados &&
      municipios
    );
  }

  function handleNext() {
    router.push("/screens/registerrestaurantdetails");
  }

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={globalCadStyles.label}>
        {required ? <Text style={globalCadStyles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>Restaurante:</Text>

      <Label text="Nome do estabelecimento:" required />
      <TextInput
        style={globalCadStyles.input}
        value={nome}
        onChangeText={setNome}
        placeholder=""
      />

      <Label text="CNPJ:" required />
      <TextInput
        style={globalCadStyles.input}
        value={cnpj}
        onChangeText={setCnpj}
        placeholder=""
        keyboardType="number-pad"
      />

      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="Telefone:" required />
          <TextInput
            style={globalCadStyles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder=""
            keyboardType="phone-pad"
          />
        </View>
        <View style={globalCadStyles.gap} />
        <View style={globalCadStyles.col}>
          <Label text="CEP:" required />
          <TextInput
            style={globalCadStyles.input}
            value={cep}
            onChangeText={setCep}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <Label text="Endereço:" required />
      <TextInput
        style={globalCadStyles.input}
        value={endereco}
        onChangeText={setEndereco}
      />

      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="Bairro:" required />
          <TextInput
            style={globalCadStyles.input}
            value={bairro}
            onChangeText={setBairro}
          />
        </View>
        <View style={globalCadStyles.gap} />
        <View style={globalCadStyles.col}>
          <Label text="Número:" required />
          <TextInput
            style={globalCadStyles.input}
            value={numero}
            onChangeText={setNumero}
            keyboardType="number-pad"
          />
        </View>
      </View>
      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="UF:" required />
          <View style={globalCadStyles.pickerContainer}>
            <Picker
              selectedValue={estadoSelecionado}
              onValueChange={(v) => setEstadoSelecionado(v)}
              style={{ backgroundColor: "#F5F5F5", borderWidth: 0 }}
            >
              <Picker.Item label="Selecione um estado..." color="#777" />
              {estados.map((e) => (
                <Picker.Item key={e.id} label={e.nome} value={e.sigla} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={globalCadStyles.gap} />
        <View style={globalCadStyles.col}>
          <Label text="Município:" required />
          <View style={globalCadStyles.pickerContainer}>
            <Picker
              selectedValue={municipioSelecionado}
              onValueChange={(v) => setMunicipioSelecionado(v)}
              enabled={!!estadoSelecionado}
              style={{ backgroundColor: "#F5F5F5", borderWidth: 0 }}
            >
              <Picker.Item
                label="Selecione um município..."
                value=""
                color="#777"
              />
              {municipios.map((m) => (
                <Picker.Item key={m.id} label={m.nome} value={m.nome} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[globalStyles.button, !requiredValid() && { opacity: 0.5 }]}
        disabled={!requiredValid()}
        onPress={handleNext}
      >
        <Text style={globalStyles.buttonlabel}>Próximo</Text>
      </TouchableOpacity>

      <Text style={globalCadStyles.legend}>* Campo Obrigatório</Text>
    </ScrollView>
  );
}
