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
//import logo from "@assets/logo.png";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = makeRedirectUri({ useProxy: true });
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
      router.replace("/(tabs)/location");
    } catch (error: any) {
      const message = error?.message || "Falha ao entrar. Verifique suas credenciais.";
      Alert.alert("Erro ao entrar", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleWeb() {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/(tabs)/location");
    } catch (error: any) {
      const message = error?.message || "Falha ao entrar com Google.";
      Alert.alert("Erro", message);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGoogleNative() {
    try {
      setGoogleLoading(true);
      const result = await promptAsync();
      if (!result?.type || result.type !== "success") return;
      const idToken = (result as any)?.authentication?.idToken;
      const accessToken = (result as any)?.authentication?.accessToken;
      if (!idToken && !accessToken) throw new Error("Não foi possível obter o token do Google.");
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, credential);
      router.replace("/(tabs)/location");
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
        margin={20}
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
    padding: 50,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  input: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    paddingVertical: 10,
    paddingLeft: 20,
    margin: 10,
    borderRadius: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#C65323",
    marginVertical: 20,
    padding: 10,
    width: "30%",
    borderRadius: 20,
  },
  buttonlabel: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#C65323",
    fontWeight: "bold",
    marginTop: 20,
  },
  providersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
  },
});
