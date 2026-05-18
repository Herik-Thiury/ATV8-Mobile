import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { auth } from "../services/firebaseConfig";

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const userEmail = auth.currentUser?.email;

  useFocusEffect(
    useCallback(() => {
      async function carregarFavoritos() {
        if (!userEmail) return;
        try {
          setCarregando(true);
          const response = await api.get(`/favoritos?userEmail=${userEmail}`);
          setFavoritos(response.data);
        } catch (error) {
          console.error("Erro ao buscar favoritos locais:", error);
        } finally {
          setCarregando(false);
        }
      }
      carregarFavoritos();
    }, [userEmail]),
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetalhePais", { paisCodigo: item.cca3 })
      }
    >
      <View style={styles.cardLeft}>
        <Image source={{ uri: item.flag }} style={styles.flag} />
        <View style={styles.infoContainer}>
          <Text style={styles.countryName}>{item.name}</Text>
          <Text style={styles.capitalName}>Capital: {item.capital}</Text>
        </View>
      </View>
      <Ionicons name="heart" size={24} color="#FF3B30" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0052CC" />
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerEmpty}>
              <Ionicons
                name="heart-dislike-outline"
                size={50}
                color="#8E8E93"
              />
              <Text style={styles.emptyText}>
                Não possui destinos favoritos ainda.
              </Text>
            </View>
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
  listContainer: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  flag: { width: 45, height: 30, borderRadius: 4, marginRight: 16 },
  infoContainer: { flex: 1 },
  countryName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  capitalName: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    marginTop: 12,
    fontSize: 16,
  },
});
