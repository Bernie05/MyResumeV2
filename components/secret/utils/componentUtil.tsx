import {
  INLINE_FIELD_LABELS,
  InlineEditableFieldId,
} from "../constants/constant";
import { IEditorInlineFieldSxProps } from "../SecretResumeEditor";

/**
 *  Utility function to generate sx styles for inline editable fields, applying special styles when the field is active or hovered, and ensuring consistent styling across different types of fields (text, icons, etc.) based on the fieldId.
 * @param fieldId - The unique identifier for the inline editable field, used to determine if it's active and to apply specific styles.
 * @param activeInlineFieldId - The currently active inline field ID, used to apply active styles if it matches the fieldId.
 * @param onInlineFieldClick - Optional click handler that, if provided, enables click interactions and hover styles for the field.
 * @returns
 */
export const getInlineFieldSx = ({
  fieldId,
  activeInlineFieldId,
  onInlineFieldClick,
}: IEditorInlineFieldSxProps) => ({
  borderRadius: 1,
  outline:
    activeInlineFieldId === fieldId
      ? "2px solid rgba(20, 184, 166, 0.9)"
      : "2px solid transparent",
  outlineOffset: 2,
  cursor: onInlineFieldClick ? "pointer" : "inherit",
  transition: "outline-color 160ms ease, box-shadow 160ms ease",
  "&:hover": onInlineFieldClick && {
    outlineColor: "rgba(20, 184, 166, 0.55)",
    boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
  },
});

/**
 * Utility function to generate user-friendly labels for inline editable fields based on their fieldId, which can represent a wide variety of fields across different sections of the resume. This function uses regex patterns to parse the fieldId and return a descriptive label that can be displayed in the UI, making it easier for users to understand which field they are editing.
 * @param fieldId - The unique identifier for the inline editable field.
 * @returns A user-friendly label for the inline editable field.
 */
export const getInlineFieldLabel = (fieldId: InlineEditableFieldId): string => {
  console.log("Getting label for fieldId:", fieldId);
  // Check if there's a direct label mapping first
  const directLabel = INLINE_FIELD_LABELS[fieldId];

  if (directLabel) {
    return directLabel;
  }

  // Handle dynamic fields with patterns
  const experienceMatch = fieldId.match(
    /^experience\.(\d+)\.(company|position|duration|location)$/,
  );

  if (experienceMatch) {
    const index = Number(experienceMatch[1]) + 1;
    const key = experienceMatch[2];
    const keyLabelMap: Record<string, string> = {
      company: "Company",
      position: "Position",
      duration: "Duration",
      location: "Location",
    };

    return `Experience #${index} ${keyLabelMap[key] ?? key}`;
  }

  const experienceBulletMatch = fieldId.match(
    /^experience\.(\d+)\.description\.(\d+)$/,
  );

  if (experienceBulletMatch) {
    const expIndex = Number(experienceBulletMatch[1]) + 1;
    const bulletIndex = Number(experienceBulletMatch[2]) + 1;
    return `Experience #${expIndex} Bullet #${bulletIndex}`;
  }

  const socialMatch = fieldId.match(/^personalInfo\.social\.(.+)$/);

  if (socialMatch) {
    const customSocialMatch = socialMatch[1].match(/^custom\.(\d+)$/);
    if (customSocialMatch) {
      return `Custom Social Link #${Number(customSocialMatch[1]) + 1}`;
    }
    return `Social: ${socialMatch[1]}`;
  }

  const customStatMatch = fieldId.match(/^stats\.custom\.(\d+)$/);
  if (customStatMatch) {
    return `Custom Stat #${Number(customStatMatch[1]) + 1}`;
  }

  const projectMatch = fieldId.match(
    /^projects\.(\d+)\.(name|description|image|technologies|link|demoUrl|caseStudy)$/,
  );

  if (projectMatch) {
    const index = Number(projectMatch[1]) + 1;
    const key = projectMatch[2];
    const keyLabelMap: Record<string, string> = {
      name: "Name",
      description: "Description",
      image: "Image URL",
      technologies: "Technologies",
      link: "Link",
      demoUrl: "Demo URL",
      caseStudy: "Case Study",
    };
    return `Project #${index} ${keyLabelMap[key] ?? key}`;
  }

  const portfolioExtendedMatch = fieldId.match(
    /^portfolio\.(\d+)\.(name|description|image|longDescription|category|technologies|demoUrl|githubUrl|testimonial|client)$/,
  );

  if (portfolioExtendedMatch) {
    const index = Number(portfolioExtendedMatch[1]) + 1;
    const key = portfolioExtendedMatch[2];
    const keyLabelMap: Record<string, string> = {
      name: "Title",
      description: "Description",
      image: "Image URL",
      longDescription: "Long Description",
      category: "Category",
      technologies: "Technologies",
      demoUrl: "Demo URL",
      githubUrl: "GitHub URL",
      testimonial: "Testimonial",
      client: "Client",
    };
    return `Portfolio #${index} ${keyLabelMap[key] ?? key}`;
  }

  const portfolioResultMatch = fieldId.match(
    /^portfolio\.(\d+)\.result\.(\d+)$/,
  );

  if (portfolioResultMatch) {
    const portIndex = Number(portfolioResultMatch[1]) + 1;
    const resultIndex = Number(portfolioResultMatch[2]) + 1;
    return `Portfolio #${portIndex} Result #${resultIndex}`;
  }

  const educationMatch = fieldId.match(
    /^education\.(\d+)\.(school|degree|year|location)$/,
  );

  if (educationMatch) {
    const index = Number(educationMatch[1]) + 1;
    const key = educationMatch[2];
    const keyLabelMap: Record<string, string> = {
      school: "School",
      degree: "Degree & Field",
      year: "Year",
      location: "Location",
    };

    return `Education #${index} ${keyLabelMap[key] ?? key}`;
  }

  const skillsCategoryMatch = fieldId.match(/^skills\.(\d+)\.category$/);

  if (skillsCategoryMatch) {
    const index = Number(skillsCategoryMatch[1]) + 1;
    return `Skill Category #${index}`;
  }

  const skillsCategoryIconMatch = fieldId.match(/^skills\.(\d+)\.icon$/);
  if (skillsCategoryIconMatch) {
    const index = Number(skillsCategoryIconMatch[1]) + 1;
    return `Skill Category #${index} Icon`;
  }

  const skillsCategorySubtitleMatch = fieldId.match(
    /^skills\.(\d+)\.subtitle$/,
  );
  if (skillsCategorySubtitleMatch) {
    const index = Number(skillsCategorySubtitleMatch[1]) + 1;
    return `Skill Category #${index} Subtitle`;
  }

  const skillsItemMatch = fieldId.match(/^skills\.(\d+)\.(\d+)\.name$/);

  if (skillsItemMatch) {
    const catIndex = Number(skillsItemMatch[1]) + 1;
    const itemIndex = Number(skillsItemMatch[2]) + 1;
    return `Skill Category #${catIndex} Item #${itemIndex}`;
  }

  const skillsItemIconMatch = fieldId.match(/^skills\.(\d+)\.(\d+)\.icon$/);
  if (skillsItemIconMatch) {
    const catIndex = Number(skillsItemIconMatch[1]) + 1;
    const itemIndex = Number(skillsItemIconMatch[2]) + 1;
    return `Skill Category #${catIndex} Item #${itemIndex} Icon`;
  }

  const skillsItemProficiencyMatch = fieldId.match(
    /^skills\.(\d+)\.(\d+)\.proficiency$/,
  );
  if (skillsItemProficiencyMatch) {
    const catIndex = Number(skillsItemProficiencyMatch[1]) + 1;
    const itemIndex = Number(skillsItemProficiencyMatch[2]) + 1;
    return `Skill Category #${catIndex} Item #${itemIndex} Proficiency`;
  }

  const certificationMatch = fieldId.match(
    /^certifications\.(\d+)\.(name|issuer|year)$/,
  );

  if (certificationMatch) {
    const index = Number(certificationMatch[1]) + 1;
    const key = certificationMatch[2];
    const keyLabelMap: Record<string, string> = {
      name: "Name",
      issuer: "Issuer",
      year: "Year",
    };

    return `Certification #${index} ${keyLabelMap[key] ?? key}`;
  }

  return fieldId;
};
