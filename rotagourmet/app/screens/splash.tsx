import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { globalStyles } from "../../styles/global";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o login após 3 segundos
    const timer = setTimeout(() => {
      router.replace("/screens/loginscreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={globalStyles.container}>
      <Image
        style={globalStyles.logo}
        contentFit="cover"
        source={require("../assets/logo.png")}
      />
    </View>
  );
}
