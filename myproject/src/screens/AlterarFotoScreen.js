import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../services/firebaseConfig";
import api from "../services/api";

export default function AlterarFotoScreen({ route, navigation }) {
  const { perfilId } = route.params || {};
  const [imagemUri, setImagemUri] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const userEmail = auth.currentUser?.email;

  const CLOUD_NAME = "daqgo66y5";
  const UPLOAD_PRESET = "atv8-mobile";

  const escolherDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImagemUri(uri);
      fazerUploadCloudinary(uri);
    }
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para usar a câmera.",
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImagemUri(uri);
      fazerUploadCloudinary(uri);
    }
  };

  // Envia a imagem para o Cloudinary e sincroniza com o JSON-Server
  const fazerUploadCloudinary = async (uri) => {
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: `profile_${Date.now()}.jpg`,
      });
      formData.append("upload_preset", UPLOAD_PRESET);

      // Chamada multipart direta para a API REST do Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        const urlFinal = data.secure_url;

        // Atualiza ou Cria o registro de perfil no JSON-Server local via Ngrok
        if (perfilId) {
          await api.patch(`/perfis/${perfilId}`, { fotoUrl: urlFinal });
        } else {
          await api.post("/perfis", {
            userEmail: userEmail,
            fotoUrl: urlFinal,
          });
        }

        Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
        navigation.goBack();
      } else {
        throw new Error("Falha ao obter URL de upload do Cloudinary.");
      }
    } catch (error) {
      console.error("Erro no upload do arquivo:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar a foto. Verifique a conexão.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho de Retorno */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#002B75" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterar Foto</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        {/* Preview da Imagem Selecionada */}
        <View style={styles.avatarWrapper}>
          {imagemUri ? (
            <Image source={{ uri: imagemUri }} style={styles.avatarPreview} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={70} color="#8E8E93" />
            </View>
          )}
          {enviando && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        </View>

        <Text style={styles.titleGuide}>Escolha uma imagem</Text>
        <Text style={styles.subtitleGuide}>
          Sua foto será enviada para o Cloudinary
        </Text>

        {/* Botão Galeria (Estilo Layout 7 - Borda Azul) */}
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={escolherDaGaleria}
          disabled={enviando}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color="#0052CC"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.galleryButtonText}>Escolher da Galeria</Text>
        </TouchableOpacity>

        {/* Botão Câmera (Estilo Layout 7 - Fundo Azul Sólido) */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={tirarFoto}
          disabled={enviando}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.cameraButtonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#002B75" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: "relative",
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  avatarPreview: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5EA",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleGuide: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  subtitleGuide: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
    marginBottom: 32,
  },
  galleryButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0052CC",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  galleryButtonText: { color: "#0052CC", fontSize: 16, fontWeight: "bold" },
  cameraButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    backgroundColor: "#0052CC",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
