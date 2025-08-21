import { StyleSheet } from "react-native";
import { borderColor, defaultColor, inputColor } from "@/app/styles/global";



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
    backgroundColor: inputColor,
    paddingVertical: 10,
    paddingLeft: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: borderColor,
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
    backgroundColor: inputColor,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: borderColor,
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
  
});
