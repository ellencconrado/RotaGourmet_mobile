// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth"; // <— namespace import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Pega funções via namespace para contornar typings
const getAuth = FirebaseAuth.getAuth;
const initializeAuth =
  (FirebaseAuth as any).initializeAuth || FirebaseAuth.getAuth;
const getReactNativePersistence =
  (FirebaseAuth as any).getReactNativePersistence;

let authInstance: any;
if (Platform.OS === "web" || !getReactNativePersistence) {
  // Se o helper não existir na sua versão, usa sessão in-memory
  authInstance = getAuth(app);
} else {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // já inicializado (hot-reload)
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
