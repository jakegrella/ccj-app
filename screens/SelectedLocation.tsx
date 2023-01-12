import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SelectedLocationHeader } from "../components";
import Constants from "expo-constants";

export function SelectedLocation({ navigation, route }) {
  const { selectedLocation } = route.params;

  const [company, setCompany] = useState(selectedLocation.company);

  useEffect(() => {
    // fetch company in order to get all locations
    async function getCompany() {
      if (selectedLocation) {
        try {
          const url = `${Constants.expoConfig?.extra?.API_DEV_URL}/api/companies/${selectedLocation.company.username}`;
          setCompany(await (await fetch(url)).json());
          return;
        } catch (err: any) {
          console.log("err", err.message);
        }
      }
    }
    getCompany();
  }, [selectedLocation]);

  return (
    <View style={styles.selectedLocation}>
      <StatusBar style="light" />

      <SelectedLocationHeader selectedLocation={selectedLocation} />

      {/* jobs */}
      {!!selectedLocation.jobs.length && (
        <View>
          <Text>{selectedLocation.jobs.length} Open Jobs</Text>
          {selectedLocation.jobs.map((job) => (
            <View
              key={job.id}
              style={styles.job}
              onTouchEnd={() => {
                navigation.navigate("Selected Job", { job });
              }}
            >
              <Text>{job.title}</Text>
            </View>
          ))}
        </View>
      )}

      {/* company info */}
      <View style={styles.companyInfo}>
        <Text>About {selectedLocation.company.name}</Text>

        <Text>Overview</Text>
        <Text>{selectedLocation.company.overview}</Text>

        {!!company?.locations?.length &&
          company?.locations?.map((l) => <Text key={l.id}>{l.locality}</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLocation: {
    backgroundColor: "#ffffff",
  },
  job: {
    backgroundColor: "#ffffff",
  },
  companyInfo: {
    backgroundColor: "red",
  },
});
