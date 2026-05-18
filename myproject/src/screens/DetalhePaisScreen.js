import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import countriesApi from "../services/countriesApi";
import api from "../services/api";
import { auth } from "../services/firebaseConfig";

export default function DetalhePaisScreen({ route, navigation }) {
  const { paisCodigo } = route.params;
  const [pais, setPais] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);

  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await countriesApi.get(`/alpha/${paisCodigo}`);
        if (response.data && response.data.length > 0) {
          const paisData = response.data[0];
          setPais(paisData);

          if (userEmail) {
            const favResponse = await api.get(
              `/favoritos?userEmail=${userEmail}&cca3=${paisCodigo}`,
            );
            if (favResponse.data && favResponse.data.length > 0) {
              setIsFavorito(true);
              setFavoritoId(favResponse.data[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados detalhados:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [paisCodigo, userEmail]);

  const handleFavorito = async () => {
    if (!userEmail) {
      Alert.alert("Erro", "Utilizador não autenticado.");
      return;
    }

    try {
      if (isFavorito) {
        await api.delete(`/favoritos/${favoritoId}`);
        setIsFavorito(false);
        setFavoritoId(null);
        Alert.alert("Sucesso", "Removido dos favoritos!");
      } else {
        const novoFavorito = {
          userEmail: userEmail,
          cca3: pais.cca3,
          name: pais.name.common,
          capital: pais.capital ? pais.capital[0] : "Não possui",
          flag: pais.flags.png,
        };

        const response = await api.post("/favoritos", novoFavorito);
        setIsFavorito(true);
        setFavoritoId(response.data.id);
        Alert.alert("Sucesso", "Adicionado aos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao gerir favorito:", error);
      Alert.alert("Erro", "Não foi possível salvar a sua preferência.");
    }
  };

  const formatarPopulacao = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0052CC" />
      </SafeAreaView>
    );
  }

  if (!pais) return null;

  const idioma = pais.languages
    ? Object.values(pais.languages)[0]
    : "Não informado";
  const moedaObj = pais.currencies ? Object.values(pais.currencies)[0] : null;
  const moeda = moedaObj
    ? `${moedaObj.name} (${moedaObj.symbol || ""})`
    : "Não informado";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <Image source={{ uri: pais.flags?.png }} style={styles.bannerImage} />

          <TouchableOpacity
            style={styles.backButtonFloating}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heartButtonFloating}
            onPress={handleFavorito}
          >
            <Ionicons
              name={isFavorito ? "heart" : "heart-outline"}
              size={24}
              color={isFavorito ? "#FF3B30" : "#FFF"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{pais.name?.common}</Text>
          <Text style={styles.subtitle}>{pais.name?.official}</Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>Capital</Text>
              </View>
              <Text style={styles.rowValue}>
                {pais.capital ? pais.capital[0] : "Não possui"}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="people-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>População</Text>
              </View>
              <Text style={styles.rowValue}>
                {formatarPopulacao(pais.population)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="language-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>Idioma</Text>
              </View>
              <Text style={styles.rowValue}>{idioma}</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>Moeda</Text>
              </View>
              <Text style={styles.rowValue}>{moeda}</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="compass-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>Região</Text>
              </View>
              <Text style={styles.rowValue}>{pais.region}</Text>
            </View>

            <View style={styles.tableRowLast}>
              <View style={styles.rowLabelContainer}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#8E8E93"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowLabel}>Fuso horário</Text>
              </View>
              <Text style={styles.rowValue}>
                {pais.timezones ? pais.timezones[0] : "Não informado"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorito && { backgroundColor: "#FF3B30" },
            ]}
            onPress={handleFavorito}
          >
            <Ionicons
              name="heart"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.favoriteButtonText}>
              {isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F9" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F9",
  },
  bannerContainer: { width: "100%", height: 240, position: "relative" },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  backButtonFloating: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 12,
  },
  heartButtonFloating: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 12,
  },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#002B75" },
  subtitle: { fontSize: 14, color: "#8E8E93", marginTop: 4, marginBottom: 24 },
  tableContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  tableRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLabelContainer: { flexDirection: "row", alignItems: "center" },
  rowIcon: { marginRight: 10 },
  rowLabel: { fontSize: 15, color: "#1A1A1A", fontWeight: "500" },
  rowValue: {
    fontSize: 15,
    color: "#48484A",
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  favoriteButton: {
    backgroundColor: "#0052CC",
    borderRadius: 12,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  favoriteButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
