// app/screens/registerclientpreferences.tsx
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../styles/global";
import { globalCadStyles } from "../styles/globalcad";
import { cuisines } from "../constants/cuisines";
import MultiSelect from "react-native-multiple-select";
import { defaultColor } from "@/constants/Colors";
import { useRegistration } from "hooks/useRegistration";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterClientPreferencesScreen() {
  const router = useRouter();
  const { clientPrefs, setClientPrefs, isEditMode, setIsEditMode } =
    useRegistration();
  const [alergias, setAlergias] = useState(
    isEditMode ? (clientPrefs?.alergiasObs ?? "") : ""
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    isEditMode ? (clientPrefs?.preferencias ?? []) : []
  );

  function Label({ text }: { text: string }) {
    return <Text style={globalCadStyles.label}>{text}</Text>;
  }

  async function handleNext() {
    setClientPrefs({
      preferencias: selectedPreferences,
      alergiasObs: alergias.trim(),
    });
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists() && userSnap.data().isGoogleUser) {
      router.replace("/home?type=client");
    } else if (isEditMode) {
      setIsEditMode(false);
      router.replace("/home?type=client");
    } else {
      router.push("/screens/registerfinal?type=client");
    }
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
        styleDropdownMenu={globalCadStyles.pickerContainer}
      />

      <Label text="Observação Alérgicas:" />
      <TextInput
        style={globalCadStyles.input}
        value={alergias}
        onChangeText={setAlergias}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleNext}>
        <Text style={globalStyles.buttonlabel}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
