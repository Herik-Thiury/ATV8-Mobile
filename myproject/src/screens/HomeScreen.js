import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import countriesApi from "../services/countriesApi";

export default function HomeScreen({ navigation }) {
  const [paises, setPaises] = useState([]);
  const [paisesFiltrados, setPaisesFiltrados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarPaises() {
      try {
        const response = await countriesApi.get(
          "/all?fields=name,capital,flags,cca3,currencies,region,subregion,languages,timezones",
        );

        const listaOrdenada = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common),
        );

        setPaises(listaOrdenada);
        setPaisesFiltrados(listaOrdenada);
      } catch (error) {
        console.error("Erro ao buscar países:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarPaises();
  }, []);

  const handleBusca = (texto) => {
    setBusca(texto);
    if (texto.trim() === '') {
      setPaisesFiltrados(paises);
    } else {
      const filtrados = paises.filter(pais => {
        const nomeValido = pais.name && pais.name.common;
        const combinaNome = nomeValido && pais.name.common.toLowerCase().includes(texto.toLowerCase());

        const capitalValida = pais.capital && pais.capital.length > 0 && pais.capital[0];
        const combinaCapital = capitalValida && pais.capital[0].toLowerCase().includes(texto.toLowerCase());

        return combinaNome || combinaCapital;
      });
      setPaisesFiltrados(filtrados);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetalhePais", { paisCodigo: item.cca3 })
      }
    >
      <View style={styles.cardLeft}>
        <Image source={{ uri: item.flags.png }} style={styles.flag} />
        <View style={styles.infoContainer}>
          <Text style={styles.countryName}>{item.name.common}</Text>
          <Text style={styles.capitalName}>
            Capital:{" "}
            {item.capital && item.capital.length > 0
              ? item.capital[0]
              : "Não possui"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Países</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar país..."
            placeholderTextColor="#8E8E93"
            value={busca}
            onChangeText={handleBusca}
          />
        </View>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052CC" />
          <Text style={styles.loadingText}>A carregar destinos...</Text>
        </View>
      ) : (
        <FlatList
          data={paisesFiltrados}
          keyExtractor={(item) => item.cca3}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum país encontrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0052CC",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  searchSection: {
    backgroundColor: "#0052CC",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 46,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: "#1A1A1A", fontSize: 16 },
  listContainer: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  flag: {
    width: 45,
    height: 30,
    borderRadius: 4,
    marginRight: 16,
    resizeMode: "cover",
  },
  infoContainer: { flex: 1 },
  countryName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  capitalName: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#8E8E93", fontSize: 16 },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    marginTop: 40,
    fontSize: 16,
  },
});
