import { Dimensions, StyleSheet, Text, View } from "react-native";
import { MyStatusBar } from "../components";

export function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>More</Text>
      <MyStatusBar style={"light"} />
    </View>
  );
}

let { height, width } = Dimensions.get("window");

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
