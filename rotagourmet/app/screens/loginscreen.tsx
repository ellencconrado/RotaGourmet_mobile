import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Platform } from "react-native";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = makeRedirectUri({ useProxy: true });

  // Check if Google auth is properly configured
  const hasGoogleConfig = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    responseType: "id_token",
    scopes: ["profile", "email"],
    redirectUri,
  });

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Informe email e senha.");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/home");
    } catch (error: any) {
      const message = error?.message || "Falha ao entrar. Verifique suas credenciais.";
      Alert.alert("Erro ao entrar", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleWeb() {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      Alert.alert("Erro", "Google Auth não está configurado para web. Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.");
      return;
    }

    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/home");
    } catch (error: any) {
      const message = error?.message || "Falha ao entrar com Google.";
      Alert.alert("Erro", message);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGoogleNative() {
    if (!request) {
      Alert.alert("Erro", "Google Auth não está configurado para dispositivos móveis.");
      return;
    }

    try {
      setGoogleLoading(true);
      const result = await promptAsync();
      if (!result?.type || result.type !== "success") return;
      const idToken = (result as any)?.authentication?.idToken;
      const accessToken = (result as any)?.authentication?.accessToken;
      if (!idToken && !accessToken) throw new Error("Não foi possível obter o token do Google.");
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, credential);
      router.replace("/home");
    } catch (error: any) {
      const message = error?.message || "Falha ao entrar com Google.";
      Alert.alert("Erro", message);
    } finally {
      setGoogleLoading(false);
    }
  }

  useEffect(() => {
    if (!response) return;
    if (response.type === "success") {
      // Tratado em handleGoogleNative após promptAsync.
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        contentFit="cover"
        source={require("../assets/logo.png")}
      />
      <Ionicons
        name="person-outline"
        style={styles.icon}
        size={150}
        color={"#C65323"}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} disabled={loading} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonlabel}>Entrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/forgotpassword")}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {hasGoogleConfig && (
        <View style={styles.providersRow}>
          <TouchableOpacity
            style={styles.socialButton}
            disabled={googleLoading || (Platform.OS !== "web" && !request)}
            onPress={Platform.OS === "web" ? handleGoogleWeb : handleGoogleNative}
          >
            {googleLoading ? (
              <ActivityIndicator color="#C65323" />
            ) : (
              <Ionicons name="logo-google" size={26} color="#C65323" />
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => router.push("/screens/registertype")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#C65323",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonlabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#C65323",
    fontSize: 16,
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  providersRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#C65323",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
