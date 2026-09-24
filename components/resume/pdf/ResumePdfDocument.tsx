import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Children } from "react";
import type { ResumeData } from "@/types/resume";

// Wrap whole words only — react-pdf hyphenates mid-word ("Pro-gram") by default
Font.registerHyphenationCallback((word) => [word]);

// Printable CV layout rendered by @react-pdf/renderer (not the DOM), so it uses
// react-pdf primitives and its own StyleSheet instead of MUI.
const ACCENT = "#0f766e";
const MUTED = "#475569";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#0f172a",
  },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  title: { fontSize: 11, color: ACCENT, marginTop: 4, letterSpacing: 1 },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    color: MUTED,
    fontSize: 9,
  },
  contactItem: { marginRight: 12 },
  link: { color: MUTED, textDecoration: "none" },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 3,
    marginBottom: 6,
  },
  entry: { marginBottom: 8 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  // Long titles wrap instead of running into the date on the right
  entryHeaderTitle: { flex: 1, marginRight: 12 },
  entryHeaderDate: { flexShrink: 0 },
  entryMeta: { color: MUTED, fontSize: 9 },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  tags: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    fontSize: 9,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginRight: 4,
    marginBottom: 4,
  },
  referenceGrid: { flexDirection: "row", flexWrap: "wrap" },
  reference: { width: "50%", marginBottom: 8, paddingRight: 8 },
  signature: { marginTop: 28, alignItems: "flex-end" },
  signatureLine: {
    width: 180,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
    paddingTop: 3,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
});

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  // The heading is bound to the first entry so it never sits alone at the bottom of a page
  const [first, ...rest] = Children.toArray(children);
  return (
    <View style={styles.section}>
      <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
};

// Placeholder links like "#/facebook" aren't real profiles, so they're left out of the CV
const isRealUrl = (href?: string) => !!href && /^https?:\/\//.test(href);

export const ResumePdfDocument = ({ resume }: { resume: ResumeData }) => {
  const { personalInfo: info } = resume;
  // Skip certifications added in the editor but not filled in yet
  const certifications = resume.certifications.filter((cert) => cert.name.trim());
  const profileLinks = [
    info.website,
    info.linkedin,
    info.github,
    ...resume.socialMedia.map((social) => social.href ?? social.url),
  ].filter(isRealUrl) as string[];

  return (
    <Document title={`${info.name} - CV`} author={info.name}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.name}>{info.name}</Text>
          <Text style={styles.title}>{info.title}</Text>
          <View style={styles.contactRow}>
            {info.email && (
              <Link style={[styles.contactItem, styles.link]} src={`mailto:${info.email}`}>
                {info.email}
              </Link>
            )}
            {info.phone && <Text style={styles.contactItem}>{info.phone}</Text>}
            {info.location && <Text style={styles.contactItem}>{info.location}</Text>}
            {info.dateOfBirth && (
              <Text style={styles.contactItem}>Born {info.dateOfBirth}</Text>
            )}
          </View>
          {profileLinks.length > 0 && (
            <View style={styles.contactRow}>
              {profileLinks.map((href) => (
                <Link key={href} style={[styles.contactItem, styles.link]} src={href}>
                  {href.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              ))}
            </View>
          )}
        </View>

        {info.summary && (
          <Section title="Summary">
            <Text>{info.summary}</Text>
          </Section>
        )}

        {resume.experience.length > 0 && (
          <Section title={resume.experienceTitle || "Experience"}>
            {resume.experience.map((job) => (
              <View key={job.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryTitle, styles.entryHeaderTitle]}>{job.position}</Text>
                  <Text style={[styles.entryMeta, styles.entryHeaderDate]}>{job.duration}</Text>
                </View>
                <Text style={styles.entryMeta}>
                  {[job.company, job.location].filter(Boolean).join(" · ")}
                </Text>
                {job.description.map((line, index) => (
                  <View key={index} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title={resume.educationTitle || "Education"}>
            {resume.education.map((school) => (
              <View key={school.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryTitle, styles.entryHeaderTitle]}>
                    {[school.degree, school.field].filter(Boolean).join(" in ")}
                  </Text>
                  <Text style={[styles.entryMeta, styles.entryHeaderDate]}>{school.year}</Text>
                </View>
                <Text style={styles.entryMeta}>
                  {[school.school, school.location].filter(Boolean).join(" · ")}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {resume.skills.length > 0 && (
          <Section title={resume.skillsTitle || "Skills"}>
            {resume.skills.map((category) => (
              <View key={category.category} style={styles.entry} wrap={false}>
                {resume.skills.length > 1 && (
                  <Text style={styles.entryTitle}>{category.category}</Text>
                )}
                <View style={styles.tags}>
                  {category.items.map((skill) => (
                    <Text key={skill.name} style={styles.tag}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title={resume.certificationsTitle || "Certifications"}>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryTitle, styles.entryHeaderTitle]}>{cert.name}</Text>
                  <Text style={[styles.entryMeta, styles.entryHeaderDate]}>{cert.year}</Text>
                </View>
                <Text style={styles.entryMeta}>{cert.issuer}</Text>
              </View>
            ))}
          </Section>
        )}

        {resume.projects.length > 0 && (
          <Section title={resume.projectsTitle || "Projects"}>
            {resume.projects.map((project) => (
              <View key={project.id} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>{project.name}</Text>
                <Text>{project.description}</Text>
                {project.technologies.length > 0 && (
                  <Text style={styles.entryMeta}>
                    {project.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {resume.characterReferences.length > 0 && (
          <Section title="Character References">
            <View style={styles.referenceGrid}>
              {resume.characterReferences.map((ref) => (
                <View key={ref.id} style={styles.reference} wrap={false}>
                  <Text style={styles.entryTitle}>{ref.name}</Text>
                  <Text style={styles.entryMeta}>
                    {[ref.position, ref.company].filter(Boolean).join(", ")}
                  </Text>
                  {ref.contactNo && <Text style={styles.entryMeta}>{ref.contactNo}</Text>}
                </View>
              ))}
            </View>
          </Section>
        )}

        {resume.declaration && (
          <View style={styles.section} wrap={false}>
            <Text>{resume.declaration}</Text>
            <View style={styles.signature}>
              <Text style={styles.signatureLine}>{info.name}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
