import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles, inputColor} from "../styles/global";
import { Picker } from "@react-native-picker/picker";
import { globalCadStyles } from "../styles/globalcad";
import { useRegistration } from "hooks/useRegistration";
import { onlyDigits, isValidCNPJ, isValidPhoneBR, isValidCEP } from "@/utils/br";



export default function RegisterRestaurantScreen() {
  const router = useRouter();
  const { setRestaurantBasics } = useRegistration();

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

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((r) => r.json())
      .then((data) =>
        setEstados(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)))
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!estadoSelecionado) {
      setMunicipios([]); setMunicipioSelecionado("");
      return;
    }
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
    )
      .then((r) => r.json())
      .then((data) =>
        setMunicipios(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)))
      )
      .catch(() => {});
  }, [estadoSelecionado]);

  function requiredValid() {
    return (
      nome && cnpj && telefone && cep && endereco && bairro && numero &&
      estadoSelecionado && municipioSelecionado
    );
  }

  function handleNext() {
    // validações BR (não salva ainda)
    if (!isValidCNPJ(cnpj)) { Alert.alert("CNPJ inválido", "Verifique o CNPJ informado."); return; }
    if (!isValidPhoneBR(telefone)) { Alert.alert("Telefone inválido", "Informe DDD + número (10 ou 11 dígitos)."); return; }
    if (!isValidCEP(cep)) { Alert.alert("CEP inválido", "O CEP deve ter 8 dígitos numéricos."); return; }

    setRestaurantBasics({
      nome: nome.trim(),
      cnpj: onlyDigits(cnpj),
      telefone: onlyDigits(telefone),
      endereco: {
        cep: onlyDigits(cep),
        logradouro: endereco.trim(),
        numero: String(numero).trim(),
        bairro: bairro.trim(),
        municipio: municipioSelecionado,
        uf: estadoSelecionado,
      },
    });

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
    <ScrollView style={globalCadStyles.container} contentContainerStyle={globalCadStyles.content}>
      <Text style={globalStyles.title}>Restaurante:</Text>

      <Label text="Nome do estabelecimento:" required />
      <TextInput style={globalCadStyles.input} value={nome} onChangeText={setNome} />

      <Label text="CNPJ:" required />
      <TextInput
        style={globalCadStyles.input}
        value={cnpj}
        onChangeText={(v) => setCnpj(onlyDigits(v))}
        keyboardType="number-pad"
      />

      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="Telefone:" required />
          <TextInput
            style={globalCadStyles.input}
            value={telefone}
            onChangeText={(v) => setTelefone(onlyDigits(v))}
            keyboardType="phone-pad"
          />
        </View>
        <View style={globalCadStyles.gap} />
        <View style={globalCadStyles.col}>
          <Label text="CEP:" required />
          <TextInput
            style={globalCadStyles.input}
            value={cep}
            onChangeText={(v) => setCep(onlyDigits(v))}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <Label text="Endereço:" required />
      <TextInput style={globalCadStyles.input} value={endereco} onChangeText={setEndereco} />

      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="Bairro:" required />
          <TextInput style={globalCadStyles.input} value={bairro} onChangeText={setBairro} />
        </View>
        <View style={globalCadStyles.gap} />
        <View style={globalCadStyles.col}>
          <Label text="Número:" required />
          <TextInput
            style={globalCadStyles.input}
            value={numero}
            onChangeText={(v) => setNumero(onlyDigits(v))}
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
              onValueChange={(v) => setEstadoSelecionado(String(v))}
              style={{ backgroundColor: inputColor, borderWidth: 0 }}
            >
              <Picker.Item label="Selecione um estado..." value="" color="#777" />
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
              onValueChange={(v) => setMunicipioSelecionado(String(v))}
              enabled={!!estadoSelecionado}
              style={{ backgroundColor: inputColor, borderWidth: 0 }}
            >
              <Picker.Item label="Selecione um município..." value="" color="#777" />
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
