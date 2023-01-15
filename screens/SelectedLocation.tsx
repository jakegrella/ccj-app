import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SelectedLocationHeader } from "../components";
import Constants from "expo-constants";
import { colors } from "../utils";

export function SelectedLocation({ navigation, route }) {
  const { selectedLocation } = route.params;

  const [company, setCompany] = useState(selectedLocation.company);

  useEffect(() => {
    // fetch company in order to get all locations
    async function getCompany() {
      if (selectedLocation) {
        try {
          const url = `${Constants.expoConfig?.extra?.API_URL}/api/companies/${selectedLocation.company.username}`;
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
        <View style={styles.selectedLocation_jobs}>
          <Text style={styles.selectedLocation_jobs_title}>
            {selectedLocation.jobs.length} Open Jobs
          </Text>
          {selectedLocation.jobs.map((job) => (
            <View
              key={job.id}
              style={styles.selectedLocation_jobs_individualJob}
              onTouchEnd={() => {
                navigation.navigate("Selected Job", { job });
              }}
            >
              <Text style={styles.selectedLocation_jobs_individualJob_title}>
                {job.title}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* company info */}
      <View style={styles.company}>
        <Text style={styles.company_name}>
          About {selectedLocation.company.name}
        </Text>

        <View style={styles.company_overview}>
          <Text style={styles.company_overview_title}>Overview</Text>
          <Text style={styles.company_overview_content}>
            {selectedLocation.company.overview}
          </Text>
        </View>

        {!!company?.locations?.length && (
          <View style={styles.company_locations}>
            <Text style={styles.company_locations_title}>Locations</Text>
            {company?.locations?.map((l) => (
              <Text
                style={styles.company_locations_individualLocation}
                key={l.id}
              >
                {l.locality}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLocation: {},
  selectedLocation_jobs: { margin: 8 },
  selectedLocation_jobs_title: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  selectedLocation_jobs_individualJob: {},
  selectedLocation_jobs_individualJob_title: {
    color: colors.white,
    fontSize: 16,
    marginVertical: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 4,
  },
  company: { margin: 8 },
  company_name: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  company_overview: {
    marginVertical: 4,
  },
  company_overview_title: {
    color: colors.white,
    fontWeight: "500",
    marginBottom: 2,
  },
  company_overview_content: { color: colors.white },
  company_locations: { marginVertical: 4 },
  company_locations_title: {
    color: colors.white,
    fontWeight: "500",
    marginBottom: 2,
  },
  company_locations_individualLocation: { color: colors.white },
});
