import { Image, StyleSheet, Text, View } from "react-native";

export function SelectedLocationHeader({ selectedLocation }) {
  return (
    <View style={styles.selectedLocation}>
      <View style={styles.selectedLocation_top}>
        <Image
          style={styles.selectedLocation_logo}
          source={{
            uri: selectedLocation.company.logo,
          }}
        />
        <View>
          <Text style={styles.selectedLocation_company}>
            {selectedLocation.company.name}
          </Text>
          <Text style={styles.selectedLocation_description}>
            {selectedLocation.company.mission}
          </Text>
        </View>
      </View>
      <Text style={styles.selectedLocation_description}>
        {selectedLocation.jobs.length} Open Jobs
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLocation: {
    width: "100%",
    padding: 16,
    backgroundColor: "#1D1D1F",
    borderRadius: 8,
  },
  selectedLocation_top: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  selectedLocation_logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedLocation_company: {
    color: "#ffffff",
  },
  selectedLocation_title: {
    color: "#ffffff",
  },
  selectedLocation_description: {
    color: "#ffffff",
  },
});
