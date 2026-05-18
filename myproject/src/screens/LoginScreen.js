import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.replace("MainApp");
    } catch (error) {
      let msg = "E-mail ou senha incorretos.";
      if (error.code === "auth/invalid-email")
        msg = "Formato de e-mail inválido.";
      Alert.alert("Falha no Login", msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Ionicons
            name="globe-outline"
            size={80}
            color="#0052CC"
            style={styles.logoIcon}
          />
          <Text style={styles.brandTitle}>CONHEÇA O MUNDO</Text>
          <Text style={styles.brandSubtitle}>Explore. Descubra. Viaje.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8E8E93"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8E8E93"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#8E8E93"
              secureTextEntry={!verSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setVerSenha(!verSenha)}>
              <Ionicons
                name={verSenha ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonMain}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.footerText}>
            Ainda não tem conta?{" "}
            <Text style={styles.footerTextBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F9" },
  flex: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logoIcon: { marginBottom: 16 },
  brandTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#002B75",
    textAlign: "center",
    letterSpacing: 1,
  },
  brandSubtitle: { fontSize: 14, color: "#8E8E93", marginTop: 4 },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  icon: { marginRight: 12 },
  input: { flex: 1, color: "#1A1A1A", fontSize: 16 },
  buttonMain: {
    backgroundColor: "#0052CC",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  footer: { alignItems: "center", marginTop: 30 },
  footerText: { color: "#8E8E93", fontSize: 14 },
  footerTextBold: { color: "#0052CC", fontWeight: "bold" },
});
