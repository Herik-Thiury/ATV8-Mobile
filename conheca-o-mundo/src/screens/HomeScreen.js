import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() { 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Início</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F9' },
  text: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' }
});