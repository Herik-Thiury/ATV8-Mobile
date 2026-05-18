import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBNRRwS-GZilyGrUyX2Wiquj5AIP-guSlw",
  authDomain: "atv8-mobile.firebaseapp.com",
  projectId: "atv8-mobile",
  storageBucket: "atv8-mobile.firebasestorage.app",
  messagingSenderId: "251320576573",
  appId: "1:251320576573:web:5b1a07d4f096d6e4b41854"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});