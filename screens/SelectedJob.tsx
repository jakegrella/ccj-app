import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils";

export function SelectedJob({ route }) {
  const { job } = route.params;

  return (
    <View>
      <StatusBar style="light" />

      <View style={styles.job}>
        <Text style={styles.job_title}>{job.title}</Text>
        <Text style={styles.job_company}>at {job.company.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  job: { margin: 8 },
  job_title: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 18,
  },
  job_company: {
    color: colors.white,
  },
});
