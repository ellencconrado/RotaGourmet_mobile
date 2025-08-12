import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";

export function LoginScreen() {
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
      <TextInput style={styles.input} placeholder="Email ou telefone" />
      <TextInput style={styles.input} placeholder="Senha" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonlabel}>Entrar</Text>
      </TouchableOpacity>
      <Text style={styles.link}>Esqueceu a Senha?</Text>
      <Text style={styles.link}>Criar conta</Text>
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
});
