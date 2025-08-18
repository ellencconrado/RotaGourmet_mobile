import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { globalCadStyles } from "../styles/globalcad";
import { globalStyles } from "../styles/global";
import { cuisines } from "../../constants/cuisines";
import MultiSelect from "react-native-multiple-select";
import { defaultColor } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RegisterRestaurantDetailsScreen() {
  const router = useRouter();
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedFood, setSelectedFood] = useState<string[]>([]);

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
    return logoUri && selectedFood;
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
    router.push("/screens/registerrestaurantoperational");
  }

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>Restaurante:</Text>

      <Label text="Logo:" required />
      <TouchableOpacity style={styles.logoPicker} onPress={handlePickLogo}>
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={styles.logoImage}
            contentFit="cover"
          />
        ) : (
          <Ionicons name="image" size={100} color={"#888"} />
        )}
      </TouchableOpacity>

      <Label text="Tipo de Culinária:" required />
      <MultiSelect
        items={cuisines.map((c) => ({ id: c.toLowerCase(), name: c }))}
        uniqueKey="id"
        onSelectedItemsChange={(selected: string[]) =>
          setSelectedFood(selected)
        }
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

      <Text style={[globalCadStyles.label, { marginTop: 16 }]}>
        Adicione as suas redes sociais:
      </Text>
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
});
