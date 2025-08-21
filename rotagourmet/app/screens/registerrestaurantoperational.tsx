import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
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

const diasMap = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export default function RegisterRestaurantOperationalScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  // Estados principais
  const [reserva, setReserva] = useState(false);
  const [fila, setFila] = useState(false);
  const [filas, setFilas] = useState([
    { nome: "Fila 1", ativo: false, editando: false },
    { nome: "Fila 2", ativo: false, editando: false },
  ]);
  const [diasFuncionamento, setDiasFuncionamento] = useState(
    diasMap.reduce(
      (acc, dia) => ({ ...acc, [dia]: false }),
      {} as Record<string, boolean>
    )
  );
  const [horarioAbertura, setHorarioAbertura] = useState("08:00");
  const [horarioFechamento, setHorarioFechamento] = useState("22:00");
  const [cardapioUri, setCardapioUri] = useState<string | null>(null);
  const [cardapioNome, setCardapioNome] = useState<string>("");
  const [precoMinimo, setPrecoMinimo] = useState(20);
  const [precoMaximo, setPrecoMaximo] = useState(80);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };
  const validarHorario = (h: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(h);

  const requiredValid = () =>
    (reserva || fila) &&
    Object.values(diasFuncionamento).some(Boolean) &&
    cardapioUri;

  const handleNext = () => {
    if (
      !validarHorario(horarioAbertura) ||
      !validarHorario(horarioFechamento)
    ) {
      showModal("Horário inválido. Digite no formato HH:mm (00:00 - 23:59)");
      return;
    }
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
      { nome: `Fila ${prev.length + 1}`, ativo: false, editando: false },
    ]);
  const toggleFila = (index: number) =>
    setFilas((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ativo: !f.ativo } : f))
    );
  const toggleEditarFila = (index: number) =>
    setFilas((prev) =>
      prev.map((f, i) => (i === index ? { ...f, editando: !f.editando } : f))
    );
  const renomearFila = (index: number, nome: string) =>
    setFilas((prev) => prev.map((f, i) => (i === index ? { ...f, nome } : f)));

  // Componentes internos
  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <Text style={globalCadStyles.label}>
      {required && <Text style={globalCadStyles.required}>* </Text>}
      {text}
    </Text>
  );

  const DiaCheckbox = ({ dia, ativo }: { dia: string; ativo: boolean }) => (
    <TouchableOpacity
      style={[styles.diaCheckbox, ativo && { backgroundColor: defaultColor }]}
      onPress={() => toggleDia(dia)}
    >
      <Text
        style={[styles.infoText, { fontSize: 12 }, ativo && { color: "white" }]}
      >
        {dia.slice(0, 3).toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const FilaItem = ({
    fila,
    index,
  }: {
    fila: { nome: string; ativo: boolean; editando: boolean };
    index: number;
  }) => (
    <View key={index} style={{ marginLeft: 20, marginBottom: 4 }}>
      <TouchableOpacity
        style={styles.addContainer}
        onPress={() => toggleFila(index)}
      >
        <View
          style={[styles.checkboxInner, fila.ativo && styles.checkboxChecked]}
        />
        {fila.editando ? (
          <TextInput
            value={fila.nome}
            onChangeText={(text) => renomearFila(index, text)}
            onBlur={() => toggleEditarFila(index)}
            autoFocus
            style={{ borderBottomWidth: 1, flex: 1 }}
          />
        ) : (
          <TouchableOpacity onPress={() => toggleEditarFila(index)}>
            <Text style={styles.checkboxLabel}>{fila.nome}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

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
              opcao === "Reserva" ? setReserva(!reserva) : setFila(!fila)
            }
          >
            <View
              style={[
                styles.checkboxInner,
                (opcao === "Reserva" ? reserva : fila) &&
                  styles.checkboxChecked,
              ]}
            />
            <Text style={styles.checkboxLabel}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {fila && (
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
            <FilaItem key={i} fila={f} index={i} />
          ))}
          <Text
            style={[
              styles.instruction,
              { textAlign: "left", marginLeft: 20, marginBottom: 8 },
            ]}
          >
            <Text style={globalCadStyles.required}>*</Text> Clique sobre o
            título para renomear
          </Text>
        </>
      )}

      <Label text="Dias de Atendimento:" required />
      <View style={styles.spaceContainer}>
        {diasMap.map((dia) => (
          <DiaCheckbox key={dia} dia={dia} ativo={diasFuncionamento[dia]} />
        ))}
      </View>

      <Label text="Horário:" required />
      <View style={styles.addContainer}>
        {[
          { value: horarioAbertura, set: setHorarioAbertura },
          { value: horarioFechamento, set: setHorarioFechamento },
        ].map((h, i) => (
          <React.Fragment key={i}>
            {i === 1 && <Text style={styles.horarioSeparator}>às</Text>}
            <TextInput
              style={styles.timeInput}
              value={h.value}
              onChangeText={h.set}
              placeholder={i === 0 ? "08:00" : "22:00"}
              keyboardType="numeric"
            />
          </React.Fragment>
        ))}
      </View>

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
        jpeg, png,...
      </Text>

      <Label text="Média de Preço:" />
      <MultiSlider
        values={[precoMinimo, precoMaximo]}
        min={0}
        max={500}
        step={1}
        sliderLength={screenWidth - 40}
        onValuesChange={(vals) => {
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalBackground}>
          <View style={globalStyles.modalContainer}>
            <Text style={globalStyles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={globalStyles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: defaultColor,
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: defaultColor,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  instruction: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  separator: {
    alignItems: "center",
    marginVertical: 16,
  },
  separatorText: {
    color: defaultColor,
    fontSize: 16,
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
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  timeInput: {
    backgroundColor: inputColor,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    textAlign: "center",
  },
  horarioSeparator: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#666",
  },
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
  cardapioIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardapioNome: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  precoText: {
    fontSize: 14,
    color: defaultColor,
    fontWeight: "bold",
  },
});
