import { Button, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils";
import * as Linking from "expo-linking";

function Section({ title, data }): JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.section_title}>{title}</Text>
      <Text style={styles.section_data}>{data}</Text>
    </View>
  );
}

function QuickInfoSection({ title, data }): JSX.Element {
  return (
    <View style={styles.quickInfoSection}>
      <Text style={styles.quickInfoSection_title}>{title}</Text>
      <Text style={styles.quickInfoSection_data}>{data}</Text>
    </View>
  );
}

export function SelectedJob({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.job}>
      <Text style={styles.job_title}>{job.title}</Text>
      <Text style={styles.job_company}>at {job.company.name}</Text>

      <View style={styles.section}>
        <Text style={styles.job_quickInfo_title}>Quick Info</Text>
        <QuickInfoSection
          title="Posted:"
          data={job.datePublished || "Unpublished"}
        />
        <QuickInfoSection title="Type:" data={job.type} />
        <QuickInfoSection title="Experience:" data={job.experience} />
        {/* <QuickInfoSection title="Pay" data={job.pay} /> */}
        {/* <QuickInfoSection title="Equity" data={job.equity} /> */}
        {/* locations */}
      </View>

      {!!job.description && (
        <Section title="Description" data={job.description} />
      )}

      {!!job.responsibilities && (
        <Section title="Responsibilities" data={job.responsibilities} />
      )}

      {!!job.qualifications && (
        <Section title="Qualifications" data={job.qualifications} />
      )}

      <Button
        title={`Apply at ${job.company.name}`}
        onPress={() => {
          Linking.openURL(job.posting);
        }}
      />
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
  job_company: { color: colors.white },
  section: { marginVertical: 4 },
  section_title: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
  },
  section_data: { color: colors.white },
  quickInfoSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  job_quickInfo_title: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
  },
  quickInfoSection_title: {
    color: colors.white,
    fontWeight: "500",
    marginBottom: 2,
    marginRight: 4,
  },
  quickInfoSection_data: { color: colors.white },
});
