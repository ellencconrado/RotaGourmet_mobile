import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function RegisterRestaurantDetailsScreen() {
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  async function handlePickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setLogoUri(result.assets[0]?.uri ?? null);
    }
  }

  function requiredValid() {
    return logoUri && cuisine;
  }

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={styles.label}>
        {required ? <Text style={styles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  function handleNext() {
    if (!requiredValid()) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios (Logo e Tipo de Culinária)." );
      return;
    }
    Alert.alert("Sucesso", "Dados coletados. Próximo passo do cadastro.");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Restaurante:</Text>

      <Label text="Logo:" required />
      <TouchableOpacity style={styles.logoPicker} onPress={handlePickLogo}>
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.logoImage} contentFit="cover" />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
      </TouchableOpacity>

      <Label text="Tipo de Culinária:" required />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={cuisine}
          onValueChange={(v: string) => setCuisine(v)}
          dropdownIconColor="#888"
        >
          <Picker.Item label="Selecione as opções..." value="" color="#777" />
          <Picker.Item label="Brasileira" value="brasileira" />
          <Picker.Item label="Italiana" value="italiana" />
          <Picker.Item label="Japonesa" value="japonesa" />
          <Picker.Item label="Hamburgueria" value="hamburgueria" />
          <Picker.Item label="Pizzaria" value="pizzaria" />
          <Picker.Item label="Árabe" value="arabe" />
          <Picker.Item label="Churrascaria" value="churrascaria" />
          <Picker.Item label="Vegana/Vegetariana" value="vegana" />
          <Picker.Item label="Outros" value="outros" />
        </Picker>
      </View>

      <Label text="Descrição:" />
      <TextInput
        style={[styles.input, styles.multiline]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Crie uma apresentação do seu estabelecimento..."
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.label, { marginTop: 16 }]}>Adicione as suas redes sociais:</Text>
      <TextInput style={styles.input} value={instagram} onChangeText={setInstagram} placeholder="Instagram (usuário ou URL)" />
      <TextInput style={styles.input} value={facebook} onChangeText={setFacebook} placeholder="Facebook (opcional)" />
      <TextInput style={styles.input} value={whatsapp} onChangeText={setWhatsapp} placeholder="WhatsApp (ex: 5599999999999)" keyboardType="phone-pad" />

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
  pickerContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    overflow: "hidden",
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
  multiline: {
    minHeight: 84,
    textAlignVertical: "top",
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


