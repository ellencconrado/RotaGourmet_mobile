import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import Slider from "@react-native-community/slider";

export default function RegisterRestaurantOperationalScreen() {
    const router = useRouter();

    // Opções de atendimento
    const [reserva, setReserva] = useState(false);
    const [fila, setFila] = useState(false);
    const [filas, setFilas] = useState<string[]>(["Fila 1", "Fila 2"]);

    // Dias de funcionamento
    const [diasFuncionamento, setDiasFuncionamento] = useState({
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
    });

    // Horário de funcionamento
    const [horarioAbertura, setHorarioAbertura] = useState("08:00");
    const [horarioFechamento, setHorarioFechamento] = useState("22:00");

    // Cardápio
    const [cardapioUri, setCardapioUri] = useState<string | null>(null);
    const [cardapioNome, setCardapioNome] = useState<string>("");

    // Faixa de preço
    const [precoMinimo, setPrecoMinimo] = useState(20);
    const [precoMaximo, setPrecoMaximo] = useState(80);

    function requiredValid() {
        return (
            (reserva || fila) &&
            Object.values(diasFuncionamento).some(dia => dia) &&
            cardapioUri
        );
    }

    function handlePickCardapio() {
        DocumentPicker.getDocumentAsync({
            type: ["application/pdf", "image/*"],
            copyToCacheDirectory: true,
        }).then((result) => {
            if (!result.canceled && result.assets[0]) {
                setCardapioUri(result.assets[0].uri);
                setCardapioNome(result.assets[0].name || "Cardápio");
            }
        });
    }

    function toggleDia(dia: keyof typeof diasFuncionamento) {
        setDiasFuncionamento(prev => ({
            ...prev,
            [dia]: !prev[dia]
        }));
    }

    function adicionarFila() {
        setFilas(prev => [...prev, `Fila ${prev.length + 1}`]);
    }

    function handleNext() {
        if (!requiredValid()) {
            Alert.alert("Atenção", "Preencha os campos obrigatórios marcados com *.");
            return;
        }
        router.push("/screens/registerfinal?type=restaurant");
    }

    function Label({ text, required }: { text: string; required?: boolean }) {
        return (
            <Text style={styles.label}>
                {required ? <Text style={styles.required}>* </Text> : null}
                {text}
            </Text>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Restaurante:</Text>

            <Label text="Opções de Atendimento:" />
            <View style={styles.checkboxContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setReserva(!reserva)}
                >
                    <View style={[styles.checkboxInner, reserva && styles.checkboxChecked]} />
                    <Text style={styles.checkboxLabel}>Reserva</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setFila(!fila)}
                >
                    <View style={[styles.checkboxInner, fila && styles.checkboxChecked]} />
                    <Text style={styles.checkboxLabel}>Fila</Text>
                </TouchableOpacity>
            </View>

            {fila && (
                <>
                    <TouchableOpacity style={styles.addButton} onPress={adicionarFila}>
                        <Text style={styles.addButtonText}>+Adicionar Fila</Text>
                    </TouchableOpacity>

                    {filas.map((nomeFila, index) => (
                        <View key={index} style={styles.filaItem}>
                            <TouchableOpacity style={styles.checkbox}>
                                <View style={[styles.checkboxInner, true && styles.checkboxChecked]} />
                                <Text style={styles.checkboxLabel}>{nomeFila}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <Text style={styles.instruction}>
                        <Text style={styles.required}>*</Text> Clique sobre o título para renomear
                    </Text>

                    <View style={styles.separator}>
                        <Text style={styles.separatorText}>***</Text>
                    </View>
                </>
            )}

            <Label text="Dias de Atendimento:" required />
            <View style={styles.diasContainer}>
                {Object.entries(diasFuncionamento).map(([dia, ativo]) => (
                    <TouchableOpacity
                        key={dia}
                        style={[styles.diaCheckbox, ativo && styles.diaCheckboxAtivo]}
                        onPress={() => toggleDia(dia as keyof typeof diasFuncionamento)}
                    >
                        <Text style={[styles.diaText, ativo && styles.diaTextAtivo]}>
                            {dia === 'dom' ? 'Dom' :
                                dia === 'seg' ? 'Seg' :
                                    dia === 'ter' ? 'Ter' :
                                        dia === 'qua' ? 'Qua' :
                                            dia === 'qui' ? 'Qui' :
                                                dia === 'sex' ? 'Sex' : 'Sab'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Label text="Horário:" required />
            <View style={styles.horarioContainer}>
                <TouchableOpacity style={styles.timeInput}>
                    <Text style={styles.timeText}>{horarioAbertura}</Text>
                </TouchableOpacity>
                <Text style={styles.horarioSeparator}>às</Text>
                <TouchableOpacity style={styles.timeInput}>
                    <Text style={styles.timeText}>{horarioFechamento}</Text>
                </TouchableOpacity>
            </View>

            <Label text="Adicionar Cardápio:" required />
            <TouchableOpacity style={styles.cardapioUpload} onPress={handlePickCardapio}>
                {cardapioUri ? (
                    <View style={styles.cardapioSelected}>
                        <Text style={styles.cardapioNome}>{cardapioNome}</Text>
                        <Text style={styles.cardapioInfo}>Arquivo selecionado</Text>
                    </View>
                ) : (
                    <View style={styles.cardapioPlaceholder}>
                        <Text style={styles.cardapioIcon}>📄</Text>
                        <Text style={styles.cardapioText}>Selecionar arquivo</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text style={styles.cardapioInfo}>
                <Text style={styles.required}>*</Text> Permite arquivo pdf, jpeg, png,...
            </Text>

            <Label text="Média de Preço:" />
            <View style={styles.precoContainer}>
                <Text style={styles.precoText}>R$ {precoMinimo.toFixed(2).replace('.', ',')}</Text>
                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={10}
                        maximumValue={200}
                        value={precoMinimo}
                        onValueChange={setPrecoMinimo}
                        minimumTrackTintColor="#C65323"
                        maximumTrackTintColor="#D9D9D9"
                        thumbTintColor="#C65323"
                    />
                    <Slider
                        style={styles.slider}
                        minimumValue={10}
                        maximumValue={200}
                        value={precoMaximo}
                        onValueChange={setPrecoMaximo}
                        minimumTrackTintColor="#C65323"
                        maximumTrackTintColor="#D9D9D9"
                        thumbTintColor="#C65323"
                    />
                </View>
                <Text style={styles.precoText}>R$ {precoMaximo.toFixed(2).replace('.', ',')}</Text>
            </View>

            <TouchableOpacity
                style={[styles.button, !requiredValid() && { opacity: 0.5 }]}
                disabled={!requiredValid()}
                onPress={handleNext}
            >
                <Text style={styles.buttonLabel}>Finalizar Cadastro</Text>
            </TouchableOpacity>

            <Text style={styles.legend}>
                <Text style={styles.required}>*</Text> Campo Obrigatório
            </Text>
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
        marginTop: 16,
        marginBottom: 4,
    },
    required: {
        color: "#C65323",
    },
    checkboxContainer: {
        marginTop: 8,
    },
    checkbox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    checkboxInner: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#C65323",
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: "#C65323",
    },
    checkboxLabel: {
        fontSize: 14,
    },
    addButton: {
        marginTop: 8,
        marginBottom: 16,
    },
    addButtonText: {
        color: "#C65323",
        fontSize: 14,
        fontWeight: "600",
    },
    filaItem: {
        marginLeft: 20,
        marginBottom: 4,
    },
    instruction: {
        fontSize: 11,
        color: "#666",
        marginLeft: 20,
        marginTop: 8,
    },
    separator: {
        alignItems: "center",
        marginVertical: 16,
    },
    separatorText: {
        color: "#C65323",
        fontSize: 16,
    },
    diasContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    diaCheckbox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#D9D9D9",
        alignItems: "center",
        justifyContent: "center",
    },
    diaCheckboxAtivo: {
        backgroundColor: "#C65323",
    },
    diaText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },
    diaTextAtivo: {
        color: "#fff",
    },
    horarioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    timeInput: {
        backgroundColor: "#D9D9D9",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 80,
        alignItems: "center",
    },
    timeText: {
        fontSize: 14,
        fontWeight: "600",
    },
    horarioSeparator: {
        marginHorizontal: 16,
        fontSize: 14,
        color: "#666",
    },
    cardapioUpload: {
        backgroundColor: "#EFEFEF",
        borderRadius: 12,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        borderWidth: 2,
        borderColor: "#D9D9D9",
        borderStyle: "dashed",
    },
    cardapioPlaceholder: {
        alignItems: "center",
    },
    cardapioIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    cardapioText: {
        fontSize: 14,
        color: "#666",
    },
    cardapioSelected: {
        alignItems: "center",
    },
    cardapioNome: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    cardapioInfo: {
        fontSize: 11,
        color: "#666",
        marginTop: 8,
        textAlign: "center",
    },
    precoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    precoText: {
        fontSize: 14,
        fontWeight: "600",
        minWidth: 60,
    },
    sliderContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    slider: {
        height: 40,
    },
    button: {
        alignSelf: "flex-start",
        backgroundColor: "#C65323",
        marginTop: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonLabel: {
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
