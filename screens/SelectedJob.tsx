import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export function SelectedJob({ navigation, route }) {
  const { job } = route.params;

  return (
    <View>
      <StatusBar style="light" />

      <Text>{job.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
