import { Dimensions, StyleSheet, Text, View } from "react-native";
import { MyStatusBar } from "../components";

export function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Saved</Text>
      <MyStatusBar style={"light"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
  },
});
