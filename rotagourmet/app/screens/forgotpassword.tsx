import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <Text style={styles.info}>Email/ Telefone:</Text>
      <TextInput style={styles.input} />
      <Text style={styles.info}>
        Enviaremos um código de confirmação para seu email:
      </Text>
      <TextInput style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonlabel}>Enviar</Text>
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
  header: {
    backgroundColor: "#C65323",
    width: "100%",
  },
  title: {
    color: "white",
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
  info: {
    fontWeight: "bold",
    textAlign: "right",
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
});
