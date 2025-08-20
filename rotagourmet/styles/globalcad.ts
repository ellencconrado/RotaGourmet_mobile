import { StyleSheet } from "react-native";
import { defaultColor } from "@/constants/Colors";

export const globalCadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingLeft: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  col: {
    flex: 1,
  },
  gap: {
    width: 12,
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  required: {
    color: defaultColor,
  },
  legend: {
    alignSelf: "flex-end",
    marginTop: 12,
    fontSize: 11,
    color: defaultColor,
  },
    modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#C65323",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
