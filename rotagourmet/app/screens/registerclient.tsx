import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "styles/global";
import { globalCadStyles } from "styles/globalcad";
import { Picker } from "@react-native-picker/picker";
import { useRegistration } from "@/hooks/useRegistration";

// ---- helpers de validação BR ----
const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");

function isValidCPF(raw: string) {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}

const isValidPhoneBR = (raw: string) => {
  const d = onlyDigits(raw);
  // 10 (fixo) ou 11 (celular c/ 9) dígitos
  return d.length === 10 || d.length === 11;
};

const isValidCEP = (raw: string) => onlyDigits(raw).length === 8;
// ---------------------------------

export default function RegisterClientScreen() {
  const router = useRouter();
  const { setClientBasics } = useRegistration();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");

  const [estados, setEstados] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");

  // Carrega estados
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => {
        const ordenados = data.sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(ordenados);
      })
      .catch(() => {});
  }, []);

  // Carrega municípios ao trocar UF
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
        })
        .catch(() => {});
    } else {
      setMunicipios([]);
      setMunicipioSelecionado("");
    }
  }, [estadoSelecionado]);

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={globalCadStyles.label}>
        {required ? <Text style={globalCadStyles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  function requiredValid() {
    return (
      nome &&
      cpf &&
      telefone &&
      cep &&
      endereco &&
      bairro &&
      numero &&
      estadoSelecionado &&
      municipioSelecionado
    );
  }

  function handleNext() {
    // validações de conteúdo
    if (!isValidCPF(cpf)) {
      Alert.alert("CPF inválido", "Verifique o CPF informado.");
      return;
    }
    if (!isValidPhoneBR(telefone)) {
      Alert.alert("Telefone inválido", "Informe DDD + número (10 ou 11 dígitos).");
      return;
    }
    if (!isValidCEP(cep)) {
      Alert.alert("CEP inválido", "O CEP deve ter 8 dígitos numéricos.");
      return;
    }

    // guarda no contexto para a próxima etapa
    setClientBasics({
      nome: nome.trim(),
      cpf: onlyDigits(cpf),
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

    // segue para preferências (que só coleta preferências e vai para a final)
    router.push("/screens/registerclientpreferences");
  }

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>Cliente:</Text>

      <Label text="Nome:" required />
      <TextInput
        style={globalCadStyles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Label text="CPF:" required />
      <TextInput
        style={globalCadStyles.input}
        value={cpf}
        onChangeText={(v) => setCpf(onlyDigits(v))}
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
              style={{ backgroundColor: "#F5F5F5", borderWidth: 0 }}
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
