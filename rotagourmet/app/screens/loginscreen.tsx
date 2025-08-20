import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { globalStyles } from "../../styles/global";
import { defaultColor } from "@/constants/Colors";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();

  // Check if Google auth is properly configured
  const hasGoogleConfig =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Em Expo Go use apenas expoClientId. Em builds nativas, forneça os ids específicos.
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
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
      const message =
        error?.message || "Falha ao entrar. Verifique suas credenciais.";
      Alert.alert("Erro ao entrar", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleWeb() {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        "Erro",
        "Google Auth não está configurado para web. Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID."
      );
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
      Alert.alert(
        "Erro",
        "Google Auth não está configurado para dispositivos móveis."
      );
      return;
    }

    try {
      setGoogleLoading(true);
      // useProxy garante redirecionamento válido no Expo Go e emuladores
      const result = await promptAsync({ useProxy: true });
      if (!result?.type || result.type !== "success") return;
      const idToken = (result as any)?.authentication?.idToken;
      const accessToken = (result as any)?.authentication?.accessToken;
      if (!idToken && !accessToken)
        throw new Error("Não foi possível obter o token do Google.");
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
    <View style={globalStyles.container}>
      <Image
        style={globalStyles.logo}
        contentFit="cover"
        source={require("../assets/logo.png")}
      />
      <Ionicons name="person-outline" style={styles.icon} />
      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Email ou número de celular"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          style={[globalStyles.input, { width: "100%" }]}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            top: "50%",
            right: 20,
            transform: [{ translateY: -24 }],
          }}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color={"#888"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          globalStyles.button,
          { width: "100%", height: 50, borderRadius: 8, marginTop: 0 },
        ]}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={globalStyles.buttonlabel}>Entrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/forgotpassword")}>
        <Text style={globalStyles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {hasGoogleConfig && (
        <View style={globalStyles.providersRow}>
          <TouchableOpacity
            style={globalStyles.socialButton}
            disabled={googleLoading || (Platform.OS !== "web" && !request)}
            onPress={
              Platform.OS === "web" ? handleGoogleWeb : handleGoogleNative
            }
          >
            {googleLoading ? (
              <ActivityIndicator color={defaultColor} />
            ) : (
              <Ionicons name="logo-google" size={26} color={defaultColor} />
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => router.push("/screens/registertype")}>
        <Text style={globalStyles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 20,
    fontSize: 100,
    color: defaultColor,
  },
});
