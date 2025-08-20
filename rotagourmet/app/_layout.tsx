import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { defaultColor } from "@/constants/Colors";
import { RegistrationProvider } from "@/hooks/useRegistration";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RegistrationProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: defaultColor,
          },
        }}
      >
        <Stack.Screen name="screens/splash" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/loginscreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/profile" options={{ title: "Perfil" }} />
        <Stack.Screen
          name="screens/notifications"
          options={{ title: "Notificações" }}
        />
        <Stack.Screen
          name="screens/contact"
          options={{ title: "Fale Conosco", headerShown: false }}
        />
        <Stack.Screen
          name="screens/plan"
          options={{ title: "Plano de Vínculo", headerShown: false }}
        />
        <Stack.Screen
          name="screens/registertype"
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="screens/forgotpassword"
          options={{ title: "Esqueci a Senha" }}
        />
        <Stack.Screen
          name="screens/registerrestaurant"
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="screens/registerrestaurantdetails"
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="screens/registerclient"
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="screens/registerclientpreferences"
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="screens/newpassword"
          options={{ title: "Nova Senha" }}
        />
        <Stack.Screen
          name="screens/registerfinal"
          options={{ title: "Finalizar Cadastro" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      </RegistrationProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
