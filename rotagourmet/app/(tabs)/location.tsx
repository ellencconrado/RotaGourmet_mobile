import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <IconSymbol size={310} color="#808080" name="location.fill" />
      <Text style={styles.title}>Location Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
});
