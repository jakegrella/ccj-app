import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

export function SelectedLocationHeader({ selectedLocation }) {
  return (
    <View style={styles.header}>
      <View style={styles.header_left}>
        <Image
          style={styles.header_left_logo}
          source={{
            uri: selectedLocation.company.logo,
          }}
        />
        <View style={styles.test}>
          <Text style={styles.header_left_companyName}>
            {selectedLocation.company.name}
          </Text>
          <Text style={styles.header_left_companyDescription}>
            {selectedLocation.company.mission}
          </Text>
        </View>
      </View>
      <View style={styles.header_jobCount}>
        <Text style={styles.header_jobCount_text}>
          {selectedLocation.jobs.length}
        </Text>
      </View>
    </View>
  );
}

let { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 12,
    backgroundColor: "#1D1D1F",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: width,
  },
  header_left: {
    flexDirection: "row",
    marginRight: 8,
    overflow: "hidden",
  },
  header_left_logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 8,
  },
  test: {
    width: "70%",
  },
  header_left_companyName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  header_left_companyDescription: {
    color: "#ffffff",
    flexWrap: "wrap",
  },
  header_jobCount: {
    height: 40,
    width: 40,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  header_jobCount_text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
