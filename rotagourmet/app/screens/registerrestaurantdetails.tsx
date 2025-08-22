import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { globalCadStyles } from "../styles/globalcad";
import { globalStyles, borderColor, defaultColor } from "../styles/global";
import { cuisines } from "../../constants/cuisines";
import MultiSelect from "react-native-multiple-select";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRegistration } from "hooks/useRegistration";

export default function RegisterRestaurantDetailsScreen() {
  const router = useRouter();
  const { setRestaurantDetails } = useRegistration();

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedFood, setSelectedFood] = useState<string[]>([]);

  useEffect(() => {
    (async () => { await ImagePicker.requestMediaLibraryPermissionsAsync(); })();
  }, []);

  async function handlePickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setLogoUri(result.assets[0]?.uri ?? null);
  }

function requiredValid() {
  return Boolean(logoUri && selectedFood.length > 0);
}

  function Label({ text, required }: { text: string; required?: boolean }) {
    return (
      <Text style={globalCadStyles.label}>
        {required ? <Text style={globalCadStyles.required}>* </Text> : null}
        {text}
      </Text>
    );
  }

  function handleNext() {
    setRestaurantDetails({
      logoUri,
      descricao: descricao.trim(),
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      whatsapp: whatsapp.trim(),
      cuisines: selectedFood,
    });
    router.push("/screens/registerrestaurantoperational");
  }

  return (
    <ScrollView style={globalCadStyles.container} contentContainerStyle={globalCadStyles.content}>
      <Text style={globalStyles.title}>Restaurante:</Text>

      <Label text="Logo:" required />
      <TouchableOpacity style={styles.logoPicker} onPress={handlePickLogo}>
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.logoImage} contentFit="cover" />
        ) : (
          <Ionicons name="image" size={100} color={"#888"} />
        )}
      </TouchableOpacity>

      <Label text="Tipo de Culinária:" required />
      <MultiSelect
        items={cuisines.map((c) => ({ id: c.toLowerCase(), name: c }))}
        uniqueKey="id"
        onSelectedItemsChange={(selected: string[]) => setSelectedFood(selected)}
        selectedItems={selectedFood}
        selectText="Selecione as opções..."
        searchInputPlaceholderText="Buscar..."
        tagRemoveIconColor={defaultColor}
        tagBorderColor={defaultColor}
        tagTextColor="#000"
        selectedItemTextColor={defaultColor}
        selectedItemIconColor={defaultColor}
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#777" }}
        submitButtonColor={defaultColor}
        submitButtonText="Confirmar"
        styleDropdownMenu={globalCadStyles.pickerContainer}
      />

      <Label text="Descrição:" />
      <TextInput
        style={[globalCadStyles.input, styles.multiline]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Crie uma apresentação do seu estabelecimento..."
        multiline
        numberOfLines={4}
      />

      <Text style={[globalCadStyles.label, { marginTop: 16 }]}>Adicione as suas redes sociais:</Text>
      <TextInput
        style={globalCadStyles.input}
        value={instagram}
        onChangeText={setInstagram}
        placeholder="Instagram (usuário ou URL)"
      />
      <TextInput
        style={globalCadStyles.input}
        value={facebook}
        onChangeText={setFacebook}
        placeholder="Facebook (opcional)"
      />
      <TextInput
        style={globalCadStyles.input}
        value={whatsapp}
        onChangeText={setWhatsapp}
        placeholder="WhatsApp (ex: 5599999999999)"
        keyboardType="phone-pad"
      />

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

const styles = StyleSheet.create({
  logoPicker: {
    backgroundColor: borderColor,
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
  multiline: { minHeight: 84, textAlignVertical: "top" },
});
