import React, { useState } from "react";
import { MaskedTextInput } from "react-native-mask-text";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { globalCadStyles } from "../styles/globalcad";
import {
  globalStyles,
  defaultColor,
  inputColor,
  borderColor,
} from "../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRegistration } from "hooks/useRegistration";
import { useModal } from "../hooks/useModal";
import { GenericModal } from "../components/GenericModal";

const diasMap = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export default function RegisterRestaurantOperationalScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const { setRestaurantOperational } = useRegistration();
  const [diasFuncionamento, setDiasFuncionamento] = useState(
    diasMap.reduce(
      (acc, d) => ({ ...acc, [d]: false }),
      {} as Record<string, boolean>
    )
  );
  const [horarios, setHorarios] = useState(
    diasMap.reduce(
      (acc, dia) => ({
        ...acc,
        [dia]: { abertura: "", fechamento: "" },
      }),
      {} as Record<string, { abertura: string; fechamento: string }>
    )
  );
  const setHorarioDia = (
    dia: string,
    campo: "abertura" | "fechamento",
    valor: string
  ) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor },
    }));
  };
  const [cardapioUri, setCardapioUri] = useState<string | null>(null);
  const [cardapioNome, setCardapioNome] = useState<string>("");
  const [precoMinimo, setPrecoMinimo] = useState(20);
  const [precoMaximo, setPrecoMaximo] = useState(80);
  const {
    visible: modalVisible,
    message: modalMessage,
    showModal,
    hideModal,
  } = useModal();

  const validarHorario = (h: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(h);

  const requiredValid = () => Object.values(diasFuncionamento).some(Boolean);

  const handleNext = () => {
    for (const dia of diasMap) {
      if (diasFuncionamento[dia]) {
        if (
          !validarHorario(horarios[dia].abertura) ||
          !validarHorario(horarios[dia].fechamento)
        ) {
          showModal(`Horário inválido para ${dia.toUpperCase()}. Use HH:mm`);
          return;
        }
      }
    }

    setRestaurantOperational({
      reserva: tipoAtendimento === "reserva",
      fila: tipoAtendimento === "fila",
      filas,
      diasFuncionamento,
      horarios,
      cardapioUri,
      cardapioNome,
      precoMinimo,
      precoMaximo,
    });

    router.push("/screens/registerfinal?type=restaurant");
  };

  const handlePickCardapio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      setCardapioUri(result.assets[0].uri);
      setCardapioNome(result.assets[0].name || "Cardápio");
    }
  };

  const toggleDia = (dia: string) =>
    setDiasFuncionamento((prev) => ({ ...prev, [dia]: !prev[dia] }));

  const adicionarFila = () =>
    setFilas((prev) => [
      ...prev,
      { nome: `Fila ${prev.length + 1}`, ativo: false },
    ]);

  const toggleFilaAtivo = (index: number) =>
    setFilas((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ativo: !f.ativo } : f))
    );

  const renomearFila = (index: number, nome: string) =>
    setFilas((prev) => prev.map((f, i) => (i === index ? { ...f, nome } : f)));

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <Text style={globalCadStyles.label}>
      {required && <Text style={globalCadStyles.required}>* </Text>}
      {text}
    </Text>
  );

  const [tipoAtendimento, setTipoAtendimento] = useState<
    "reserva" | "fila" | null
  >(null);
  const [filas, setFilas] = useState<{ nome: string; ativo: boolean }[]>([]);

  return (
    <ScrollView
      style={globalCadStyles.container}
      contentContainerStyle={globalCadStyles.content}
    >
      <Text style={globalStyles.title}>Restaurante:</Text>
      <Label text="Opções de Atendimento:" />
      <View style={{ marginTop: 8 }}>
        {["Reserva", "Fila"].map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={styles.addContainer}
            onPress={() =>
              setTipoAtendimento(opcao.toLowerCase() as "reserva" | "fila")
            }
          >
            <View style={styles.radioOuter}>
              {tipoAtendimento === opcao.toLowerCase() && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tipoAtendimento === "fila" && (
        <>
          <TouchableOpacity
            style={{ marginTop: 10, marginBottom: 5 }}
            onPress={adicionarFila}
          >
            <Text style={[styles.infoText, { color: defaultColor }]}>
              +Adicionar Fila
            </Text>
          </TouchableOpacity>

          {filas.map((f, i) => (
            <View key={i} style={{ marginLeft: 20, marginBottom: 4 }}>
              <TouchableOpacity
                style={styles.addContainer}
                onPress={() => toggleFilaAtivo(i)}
              >
                <View
                  style={[
                    styles.checkboxInner,
                    f.ativo && styles.checkboxChecked,
                  ]}
                />
                <TextInput
                  value={f.nome}
                  onChangeText={(text) => renomearFila(i, text)}
                  style={{ borderBottomWidth: 1, flex: 1 }}
                />
              </TouchableOpacity>
            </View>
          ))}

          <Text
            style={[
              styles.instruction,
              { textAlign: "left", marginLeft: 20, marginBottom: 8 },
            ]}
          >
            <Text style={globalCadStyles.required}>*</Text> Toque no nome para
            renomear
          </Text>
        </>
      )}
      <Label text="Dias de Atendimento:" required />{" "}
      <View style={styles.spaceContainer}>
        {" "}
        {diasMap.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.diaCheckbox,
              diasFuncionamento[dia] && { backgroundColor: defaultColor },
            ]}
            onPress={() => toggleDia(dia)}
          >
            {" "}
            <Text
              style={[
                styles.infoText,
                { fontSize: 12 },
                diasFuncionamento[dia] && { color: "#fff", fontWeight: "700" },
              ]}
            >
              {" "}
              {dia.toUpperCase()}{" "}
            </Text>{" "}
          </TouchableOpacity>
        ))}{" "}
      </View>
      <Label text="Horário:" required />
      {diasMap.map((dia) =>
        diasFuncionamento[dia] ? (
          <View key={dia} style={styles.addContainer}>
            <Text
              style={{
                width: 80,
                fontWeight: "600",
                color: defaultColor,
                marginLeft: 10,
              }}
            >
              {dia.toUpperCase()}
            </Text>
            <MaskedTextInput
              mask="99:99"
              value={horarios[dia].abertura}
              onChangeText={(v) => setHorarioDia(dia, "abertura", v)}
              keyboardType="numeric"
              style={styles.timeInput}
              placeholder="00:00"
            />
            <Text style={styles.horarioSeparator}>às</Text>
            <MaskedTextInput
              mask="99:99"
              value={horarios[dia].fechamento}
              onChangeText={(v) => setHorarioDia(dia, "fechamento", v)}
              keyboardType="numeric"
              style={styles.timeInput}
              placeholder="00:00"
            />
          </View>
        ) : null
      )}
      <Label text="Adicionar Cardápio:" />
      <TouchableOpacity
        style={styles.cardapioUpload}
        onPress={handlePickCardapio}
      >
        {cardapioUri ? (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.cardapioNome}>{cardapioNome}</Text>
            <Text style={styles.instruction}>Arquivo selecionado</Text>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Ionicons name="document" size={50} color="#888" />
            <Text style={styles.infoText}>Selecionar arquivo</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.instruction}>
        <Text style={globalCadStyles.required}>*</Text> Permite arquivo pdf,
        jpeg, png...
      </Text>
      <Label text="Média de Preço:" />
      <MultiSlider
        values={[precoMinimo, precoMaximo]}
        min={0}
        max={500}
        step={1}
        sliderLength={screenWidth - 40}
        onValuesChange={(vals: number[]) => {
          setPrecoMinimo(vals[0]);
          setPrecoMaximo(vals[1]);
        }}
        selectedStyle={{ backgroundColor: defaultColor, height: 3 }}
        unselectedStyle={{ backgroundColor: borderColor }}
        markerStyle={{ backgroundColor: defaultColor }}
      />
      <View style={styles.spaceContainer}>
        <Text style={styles.precoText}>
          R$ {precoMinimo.toFixed(2).replace(".", ",")}
        </Text>
        <Text style={styles.precoText}>
          R$ {precoMaximo.toFixed(2).replace(".", ",")}
        </Text>
      </View>
      <TouchableOpacity
        style={[globalStyles.button, !requiredValid() && { opacity: 0.5 }]}
        disabled={!requiredValid()}
        onPress={handleNext}
      >
        <Text style={globalStyles.buttonlabel}>Finalizar Cadastro</Text>
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

const styles = StyleSheet.create({
  addContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: defaultColor,
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: { backgroundColor: defaultColor },
  checkboxLabel: { fontSize: 14 },
  instruction: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  spaceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  diaCheckbox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: inputColor,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { fontSize: 14, fontWeight: "600", color: "#666" },
  timeInput: {
    backgroundColor: inputColor,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    textAlign: "center",
  },
  horarioSeparator: { marginHorizontal: 16, fontSize: 14, color: "#666" },
  cardapioUpload: {
    backgroundColor: borderColor,
    borderRadius: 12,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: inputColor,
    borderStyle: "dashed",
  },
  cardapioNome: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  precoText: { fontSize: 14, color: defaultColor, fontWeight: "bold" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: defaultColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: defaultColor,
  },
});
