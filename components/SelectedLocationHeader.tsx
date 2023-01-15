import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils";

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
        <View style={styles.header_left_words}>
          <Text style={styles.header_left_words_companyName}>
            {selectedLocation.company.name}
          </Text>
          <Text style={styles.header_left_words_companyDescription}>
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
    padding: 8,
    backgroundColor: colors.black,
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
  header_left_words: {
    width: "70%",
  },
  header_left_words_companyName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  header_left_words_companyDescription: {
    color: colors.white,
    flexWrap: "wrap",
  },
  header_jobCount: {
    height: 40,
    width: 40,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  header_jobCount_text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
