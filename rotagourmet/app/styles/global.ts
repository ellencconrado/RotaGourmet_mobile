import { StyleSheet } from "react-native";
import { defaultColor } from "@/constants/Colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 280,
    height: 180,
    marginTop: 0,
  },
   title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  label: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#F5F5F5",
    width: "auto",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  
  button: {
    marginTop: 25,
    alignSelf: "center",
    backgroundColor: defaultColor,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  buttonlabel: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: defaultColor,
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textShadowColor: "#0000003c",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
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
    borderColor: defaultColor,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
