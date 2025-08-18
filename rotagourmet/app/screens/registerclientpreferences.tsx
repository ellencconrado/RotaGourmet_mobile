import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../styles/global";
import { globalCadStyles } from "../styles/globalcad";
import { cuisines } from "../../constants/cuisines";
import MultiSelect from "react-native-multiple-select";
import { defaultColor } from "@/constants/Colors";

export default function RegisterClientPreferencesScreen() {
  const router = useRouter();
  const [alergias, setAlergias] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  function Label({ text }: { text: string }) {
    return <Text style={globalCadStyles.label}>{text}</Text>;
  }

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>Cliente:</Text>

      <Label text="Preferências gastronômicas:" />
      <MultiSelect
        items={cuisines.map((c) => ({ id: c.toLowerCase(), name: c }))}
        uniqueKey="id"
        onSelectedItemsChange={(selected: string[]) =>
          setSelectedPreferences(selected)
        }
        selectedItems={selectedPreferences}
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
        styleDropdownMenu={globalCadStyles.pickerContainer} // opcional: aplica seu estilo
      />
      <Label text="Observação Alérgicas:" />
      <TextInput
        style={globalCadStyles.input}
        value={alergias}
        onChangeText={setAlergias}
      />

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/screens/registerfinal?type=client")}
      >
        <Text style={globalStyles.buttonlabel}>Próximo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
