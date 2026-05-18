import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebaseConfig";
import api from "../services/api";

export default function PerfilScreen({ navigation }) {
  const [carregando, setCarregando] = useState(true);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [perfilId, setPerfilId] = useState(null);

  const userEmail = auth.currentUser?.email;
  const userName =
    auth.currentUser?.displayName || userEmail?.split("@")[0] || "Utilizador";

  useFocusEffect(
    useCallback(() => {
      async function carregarDadosPerfil() {
        if (!userEmail) return;
        try {
          setCarregando(true);

          const favResponse = await api.get(
            `/favoritos?userEmail=${userEmail}`,
          );
          setTotalFavoritos(favResponse.data.length);

          const perfilResponse = await api.get(
            `/perfis?userEmail=${userEmail}`,
          );
          if (perfilResponse.data && perfilResponse.data.length > 0) {
            setFotoPerfil(perfilResponse.data[0].fotoUrl);
            setPerfilId(perfilResponse.data[0].id);
          }
        } catch (error) {
          console.error("Erro ao carregar dados do perfil:", error);
        } finally {
          setCarregando(false);
        }
      }

      carregarDadosPerfil();
    }, [userEmail]),
  );

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível encerrar a sessão.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0052CC" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {fotoPerfil ? (
                <Image
                  source={{ uri: fotoPerfil }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={50} color="#8E8E93" />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={() =>
                  navigation.navigate("AlterarFoto", { perfilId: perfilId })
                }
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.nameText}>{userName}</Text>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalFavoritos}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Países visitados</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Resenhas</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color="#48484A"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Editar Perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate("AlterarFoto", { perfilId: perfilId })
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="image-outline"
                  size={20}
                  color="#48484A"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Alterar Foto</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#48484A"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Alterar Senha</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#FF3B30"
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: "#FF3B30", fontWeight: "bold" },
                  ]}
                >
                  Sair
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  avatarSection: { alignItems: "center", marginTop: 10, marginBottom: 24 },
  avatarContainer: { width: 110, height: 110, position: "relative" },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#0052CC",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#002B75",
    marginTop: 14,
  },
  emailText: { fontSize: 14, color: "#8E8E93", marginTop: 2 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    textAlign: "center",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuIcon: { marginRight: 12 },
  menuItemText: { fontSize: 16, color: "#1A1A1A", fontWeight: "500" },
});
