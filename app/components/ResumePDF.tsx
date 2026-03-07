"use client";
import { RevisedResume } from "@/types/report-types";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// The ResumePDF component uses @react-pdf/renderer to create a PDF document based on the optimized resume data.
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1f2937"
  },
  header: {
    alignItems: "center",
    marginBottom: 8
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  jobTitle: {
    fontSize: 10,
    color: "#2563eb",
    marginTop: 2,
    textTransform: "uppercase"
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 6
  },
  section: {
    marginTop: 5
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  summary: {
    lineHeight: 1.05,
    textAlign: "justify",
    color: "#475569"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3
  },
  skillBadge: {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    border: "0.5 solid #e2e8f0",
    padding: "1 5",
    borderRadius: 2,
    fontSize: 7.5
  },
  experienceBlock: {
    marginBottom: 4
  },
  roleBox: {
    backgroundColor: "#f8fafc",
    padding: "2 4",
    marginBottom: 1,
    borderLeft: 2,
    borderLeftColor: "#2563eb"
  },
  role: {
    fontWeight: "bold",
    fontSize: 9.5,
    color: "#0f172a"
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 0
  },
  bulletDot: {
    width: 9,
    fontSize: 11,
    color: "#2563eb"
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.02,
    color: "#334155"
  },
  eduItem: {
    marginBottom: 3
  },
  eduDegree: {
    fontWeight: "bold",
    fontSize: 9,
    lineHeight: 1.15
  },
  eduDetail: {
    fontSize: 8.5,
    color: "#475569",
    lineHeight: 1.15
  }
});

export function ResumePDF({ data }: { data: RevisedResume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "Professional Name"}</Text>
          <Text style={styles.jobTitle}>{data.jobTitle || "Candidate Profile"}</Text>
        </View>

        <View style={styles.divider} />

        {/* SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.summary}>{data.revisedSummary}</Text>
        </View>

        {/* SKILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Technical Proficiencies</Text>
          <View style={styles.grid}>
            {data.suggestedSkills?.map((skill, i) => (
              <Text key={i} style={styles.skillBadge}>{skill}</Text>
            ))}
          </View>
        </View>

        {/* EXPERIENCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>

          {data.revisedExperience?.map((item, i) => (
            <View key={i} style={styles.experienceBlock} wrap={false}>
              
              <View style={styles.roleBox}>
                <Text style={styles.role}>{item.role}</Text>
              </View>

              {item.optimizedBulletPoints?.map((point, j) => (
                <View key={j} style={styles.bulletContainer}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* EDUCATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>

          {data.education?.map((edu, i) => (
            <View key={i} style={styles.eduItem}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduDetail}>{edu.school} — {edu.year}</Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
}