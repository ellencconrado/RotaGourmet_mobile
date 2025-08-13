import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
    const [searchText, setSearchText] = useState("");

    // Dados mockados para demonstração
    const rotasGastronomicas = [
        { id: 1, nome: "Rota das Cervejas", cor: "#FF0000" },
        { id: 2, nome: "Rota das Vinícolas", cor: "#FF0000" },
        { id: 3, nome: "Criar Rota Gastronômica", isCreate: true }
    ];

    const todosRestaurantes = [
        { id: 1, nome: "Restaurante Italiano", tipo: "Italiana", avaliacao: 4.5, preco: "$$" },
        { id: 2, nome: "Churrascaria Premium", tipo: "Churrasco", avaliacao: 4.8, preco: "$$$" },
        { id: 3, nome: "Sushi Bar", tipo: "Japonesa", avaliacao: 4.3, preco: "$$" },
        { id: 4, nome: "Pizzaria Artesanal", tipo: "Pizza", avaliacao: 4.6, preco: "$" },
        { id: 5, nome: "Restaurante Vegano", tipo: "Vegana", avaliacao: 4.2, preco: "$$" },
    ];

    const restaurantesFiltrados = searchText
        ? todosRestaurantes.filter(rest =>
            rest.nome.toLowerCase().includes(searchText.toLowerCase()) ||
            rest.tipo.toLowerCase().includes(searchText.toLowerCase())
        )
        : todosRestaurantes;

    const mapsGourmet = [
        // Aqui você pode adicionar mapas/rotas
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoWheel}>
                        <Ionicons name="compass" size={40} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>ROTA GOURMET</Text>
                    <Text style={styles.tagline}>EXPERIÊNCIAS GASTRONÔMICAS</Text>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Busque por um restaurante"
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Rotas Gastronômicas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rotas Gastronômicas:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {rotasGastronomicas.map((rota) => (
                            <TouchableOpacity
                                key={rota.id}
                                style={[
                                    styles.rotaCard,
                                    rota.isCreate && styles.createRotaCard
                                ]}
                            >
                                {rota.isCreate ? (
                                    <>
                                        <Ionicons name="add-circle" size={32} color="#C65323" />
                                        <Text style={styles.createRotaText}>{rota.nome}</Text>
                                    </>
                                ) : (
                                    <Text style={[styles.rotaText, { color: rota.cor }]}>{rota.nome}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.dotsIndicator}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                {/* Restaurantes Gourmet */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Restaurantes Gourmet:</Text>
                    {restaurantesFiltrados.length > 0 ? (
                        restaurantesFiltrados.map((restaurante) => (
                            <TouchableOpacity key={restaurante.id} style={styles.restauranteCard}>
                                <View style={styles.restauranteInfo}>
                                    <Text style={styles.restauranteNome}>{restaurante.nome}</Text>
                                    <Text style={styles.restauranteTipo}>{restaurante.tipo}</Text>
                                    <View style={styles.restauranteMeta}>
                                        <View style={styles.avaliacaoContainer}>
                                            <Ionicons name="star" size={16} color="#FFD700" />
                                            <Text style={styles.avaliacaoText}>{restaurante.avaliacao}</Text>
                                        </View>
                                        <Text style={styles.precoText}>{restaurante.preco}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.verMaisButton}>
                                    <Text style={styles.verMaisText}>Ver mais</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>
                                {searchText ? "Nenhum restaurante encontrado" : "Lista de restaurantes aparecerá aqui"}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Maps Gourmet */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Maps Gourmet:</Text>
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Mapa gastronômico aparecerá aqui</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#C65323",
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        flex: 1,
    },
    logoWheel: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    logoText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    tagline: {
        color: "#fff",
        fontSize: 12,
        opacity: 0.9,
    },
    menuButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "#fff",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D9D9D9",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    horizontalScroll: {
        marginBottom: 12,
    },
    rotaCard: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        marginRight: 16,
        minWidth: 140,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    createRotaCard: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#C65323",
        borderStyle: "dashed",
    },
    rotaText: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    createRotaText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#C65323",
        textAlign: "center",
        marginTop: 8,
    },
    dotsIndicator: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C65323",
    },
    placeholderContainer: {
        backgroundColor: "#D9D9D9",
        height: 120,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
    },
    restauranteCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    restauranteInfo: {
        flex: 1,
    },
    restauranteNome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    restauranteTipo: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    restauranteMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    avaliacaoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    avaliacaoText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    precoText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#C65323",
    },
    verMaisButton: {
        backgroundColor: "#C65323",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    verMaisText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
});
