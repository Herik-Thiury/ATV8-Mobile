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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => navigation.replace("MainApp") },
      ]);
    } catch (error) {
      let msg = "Erro ao realizar cadastro.";
      if (error.code === "auth/email-already-in-use")
        msg = "Este e-mail já está em uso.";
      if (error.code === "auth/weak-password")
        msg = "A senha deve conter pelo menos 6 caracteres.";
      Alert.alert("Falha", msg);
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#002B75" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para se cadastrar
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#8E8E93"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#8E8E93"
                value={nome}
                onChangeText={setNome}
              />
            </View>

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
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
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
                placeholder="Confirmar senha"
                placeholderTextColor="#8E8E93"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.buttonMain}
              onPress={handleCadastro}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerText}>
              Já tem conta?{" "}
              <Text style={styles.footerTextBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F9" },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 20,
  },
  backButton: { alignSelf: "flex-start", marginBottom: 20, marginTop: 10 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: "#002B75" },
  subtitle: { fontSize: 14, color: "#8E8E93", marginTop: 4 },
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
