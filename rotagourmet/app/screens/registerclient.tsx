import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../styles/global";
import { globalCadStyles } from "../styles/globalcad";
import { useRegistration } from "hooks/useRegistration";
import { GenericModal } from "../components/GenericModal";
import { useModal } from "../hooks/useModal";
import { getEnderecoByCep } from "../api/brasilApi";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");

const validators = {
  cpf: (raw: string) => {
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
  },
  phone: (raw: string) => {
    const d = onlyDigits(raw);
    return d.length === 10 || d.length === 11;
  },
  cep: (raw: string) => onlyDigits(raw).length === 8,
};

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <Text style={globalCadStyles.label}>
      {required ? <Text style={globalCadStyles.required}>* </Text> : null}
      {text}
    </Text>
  );
}

export default function RegisterClientScreen() {
  const router = useRouter();
  const { clientBasics, setClientBasics, isEditMode, setIsEditMode } =
    useRegistration();
  const [nome, setNome] = useState(
    isEditMode ? (clientBasics?.nome ?? "") : ""
  );
  const [cpf, setCpf] = useState(isEditMode ? (clientBasics?.cpf ?? "") : "");
  const [telefone, setTelefone] = useState(
    isEditMode ? (clientBasics?.telefone ?? "") : ""
  );
  const [cep, setCep] = useState(
    isEditMode ? (clientBasics?.endereco?.cep ?? "") : ""
  );
  const [endereco, setEndereco] = useState(
    isEditMode ? (clientBasics?.endereco?.logradouro ?? "") : ""
  );
  const [bairro, setBairro] = useState(
    isEditMode ? (clientBasics?.endereco?.bairro ?? "") : ""
  );
  const [numero] = useState(
    isEditMode ? (clientBasics?.endereco?.numero ?? "") : ""
  );
  const [estadoSelecionado, setEstadoSelecionado] = useState(
    isEditMode ? (clientBasics?.endereco?.uf ?? "") : ""
  );
  const [municipioSelecionado, setMunicipioSelecionado] = useState(
    isEditMode ? (clientBasics?.endereco?.municipio ?? "") : ""
  );
  const {
    visible: modalVisible,
    message: modalMessage,
    showModal,
    hideModal,
  } = useModal();

  useEffect(() => {
    if (!isEditMode) return;
    const user = auth.currentUser;
    if (user) {
      setNome(user.displayName ?? "");
      setCpf(""); // CPF provavelmente você armazena no Firestore
      setTelefone(""); // Telefone também
      // Buscar dados adicionais do Firestore
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setCpf(data.cpf ?? "");
          setTelefone(data.telefone ?? "");
          setCep(data.endereco?.cep ?? "");
          setEndereco(data.endereco?.logradouro ?? "");
          setBairro(data.endereco?.bairro ?? "");
          setEstadoSelecionado(data.endereco?.uf ?? "");
          setMunicipioSelecionado(data.endereco?.municipio ?? "");
        }
      });
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!validators.cep(cep)) return;

    const timeout = setTimeout(async () => {
      try {
        const data = await getEnderecoByCep(cep);
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setEstadoSelecionado(data.estado || "");
        setMunicipioSelecionado(data.localidade || "");
      } catch (err: any) {
        showModal(err.message || "Erro ao buscar CEP.");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [cep, showModal]);

  const requiredValid = () => [nome, cpf, telefone, cep].every(Boolean);

  function handleNext() {
    if (!validators.cpf(cpf)) {
      showModal("CPF inválido. Verifique o CPF informado.");
      return;
    }
    if (!validators.phone(telefone)) {
      showModal("Telefone inválido. Informe DDD + número (10 ou 11 dígitos).");
      return;
    }
    if (!validators.cep(cep)) {
      showModal("CEP inválido. O CEP deve ter 8 dígitos numéricos.");
      return;
    }

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
    setIsEditMode(false); 

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
        placeholder="XXX.XXX.XXX-XX"
        placeholderTextColor="#888"
        onChangeText={(v) => setCpf(onlyDigits(v))}
        keyboardType="number-pad"
      />

      <View style={globalCadStyles.row}>
        <View style={globalCadStyles.col}>
          <Label text="Telefone:" required />
          <TextInput
            style={globalCadStyles.input}
            value={telefone}
            placeholder="(XX) XXXXX-XXXX"
            placeholderTextColor="#888"
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
            placeholder="XXXXX-XXX"
            placeholderTextColor="#888"
            onChangeText={(v) => setCep(onlyDigits(v))}
            keyboardType="number-pad"
          />
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

      <GenericModal
        visible={modalVisible}
        message={modalMessage}
        onClose={hideModal}
      />
    </ScrollView>
  );
}
