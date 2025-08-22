// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth"; // namespace p/ compat de typings
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
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

// ------- Auth (com persistência no RN) -------
const getAuth = FirebaseAuth.getAuth;
const initializeAuth =
  (FirebaseAuth as any).initializeAuth || FirebaseAuth.getAuth;
const getReactNativePersistence =
  (FirebaseAuth as any).getReactNativePersistence;

let authInstance: any;
if (Platform.OS === "web" || !getReactNativePersistence) {
  // Web ou versões antigas sem helper de persistência
  authInstance = getAuth(app);
} else {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // hot-reload: já inicializado
    authInstance = getAuth(app);
  }
}
export const auth = authInstance;

// ------- Firestore (com long polling auto) -------
let _db;
try {
  // Em RN/Expo alguns ambientes precisam de long polling
  _db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  // se initializeFirestore já foi chamado ou não existir, cai no getFirestore
  _db = getFirestore(app);
}
export const db = _db;

// ------- Storage -------
export const storage = getStorage(app);

// ------- Emulators em DEV -------
const USE_EMULATORS = __DEV__; // se preferir controlar via env: process.env.EXPO_PUBLIC_USE_EMULATORS === "1"
const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";

if (USE_EMULATORS) {
  // Auth
  try {
    FirebaseAuth.connectAuthEmulator(auth, `http://${host}:9099`, {
      disableWarnings: true,
    });
  } catch {
    // já conectado (hot-reload)
  }

  // Firestore
  try {
    connectFirestoreEmulator(db as any, host, 8080);
  } catch {
    // já conectado (hot-reload)
  }

  // Storage
  try {
    connectStorageEmulator(storage, host, 9199);
  } catch {
    // já conectado (hot-reload)
  }
}
