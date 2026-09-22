import { Box, IconButton } from "@mui/material";
import { ResumeEditableSection } from "@/components/resume/ResumePage";
import { ICON_MAP, ICON_NAMES } from "@/components/resume/ServicesSection";
import {
  INLINE_FIELD_LABELS,
  InlineEditableFieldId,
} from "../constants/constant";
import {
  IEditorCreateInlineFieldProps,
  IEditorFieldAndSectionProps,
  IEditorInlineFieldSxProps,
} from "../SecretResumeEditor";

// test V2
export const getInlineFieldSxV2 = ({
  fieldId,
  activeInlineFieldId,
  isEditMode = false,
}: IEditorInlineFieldSxProps) => ({
  borderRadius: 1,
  outline:
    activeInlineFieldId === fieldId
      ? "2px solid rgba(20, 184, 166, 0.9)"
      : "2px solid transparent",
  outlineOffset: 2,
  cursor: getCursorPointer(isEditMode),
  transition: "outline-color 160ms ease, box-shadow 160ms ease",
  "&:hover": isEditMode && {
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

  const socialMatch = fieldId.match(/^personalInfo\.social\.(\d+)$/);

  if (socialMatch) {
    return `Social Link #${Number(socialMatch[1]) + 1}`;
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

  const projectTechItemMatch = fieldId.match(
    /^projects\.(\d+)\.technologies\.(\d+)$/,
  );

  if (projectTechItemMatch) {
    const projIndex = Number(projectTechItemMatch[1]) + 1;
    const techIndex = Number(projectTechItemMatch[2]) + 1;
    return `Project #${projIndex} Tag #${techIndex}`;
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

  const portfolioTechItemMatch = fieldId.match(
    /^portfolio\.(\d+)\.technologies\.(\d+)$/,
  );

  if (portfolioTechItemMatch) {
    const portIndex = Number(portfolioTechItemMatch[1]) + 1;
    const techIndex = Number(portfolioTechItemMatch[2]) + 1;
    return `Portfolio #${portIndex} Tag #${techIndex}`;
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

const handleSectionClick = (
  sectionId: ResumeEditableSection,
  onSectionClick: ((sectionId: ResumeEditableSection) => void) | undefined,
) => {
  onSectionClick?.(sectionId);
};

/**
 * Utility function to generate props for resume sections that can be edited in the SecretResumeEditor, enabling click interactions and keyboard accessibility when an onSectionClick handler is provided. This function helps to keep the ResumePage component cleaner by abstracting the logic for making sections interactive based on the presence of the onSectionClick handler and the active section state.
 * @param interactiveSections - A boolean indicating whether sections should be interactive (clickable).
 * @param sectionId - The unique identifier for the resume section, used to determine which section was clicked and to apply specific styles if needed.
 * @param onSectionClick - Optional click handler that, if provided, enables click interactions and keyboard accessibility for the section.
 */
export const createSectionProps = (
  interactiveSections: boolean,
  sectionId: ResumeEditableSection,
  onSectionClick: ((sectionId: ResumeEditableSection) => void) | undefined,
) => {
  if (!interactiveSections || !onSectionClick) {
    return {};
  }

  return {
    role: "button",
    tabIndex: 0,
    "aria-label": `Edit ${sectionId} section`,
    onClick: () => handleSectionClick(sectionId, onSectionClick),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSectionClick(sectionId, onSectionClick);
      }
    },
  };
};

/**
 * Utility function to generate props for inline editable fields in the SecretResumeEditor, enabling click interactions and keyboard accessibility when an onInlineFieldClick handler is provided. This function abstracts the logic for making fields interactive based on the presence of the onInlineFieldClick handler and the active field state, and it can be used across different types of fields (text, icons, etc.) by simply passing the appropriate fieldId and sectionId.
 * @param sectionId - The unique identifier for the resume section that the field belongs to, used to provide context for the onInlineFieldClick handler.
 * @param fieldId - The unique identifier for the inline editable field, used to determine which field was clicked and to apply specific styles if needed.
 * @param onInlineFieldClick - Optional click handler that, if provided, enables click interactions and keyboard accessibility for the field.
 * @returns An object containing the necessary props to make the field interactive in the SecretResumeEditor.
 */
export const createInlineFieldProps = (
  sectionId: ResumeEditableSection,
  fieldId: InlineEditableFieldId,
  onInlineFieldClick:
    | ((
        section: ResumeEditableSection,
        fieldId: InlineEditableFieldId,
        anchor?: HTMLElement,
      ) => void)
    | undefined,
) => {
  if (!onInlineFieldClick) {
    return {};
  }

  return {
    onClick: (event: React.MouseEvent) => {
      event.stopPropagation();
      onInlineFieldClick(
        sectionId,
        fieldId,
        event.currentTarget as HTMLElement,
      );
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        onInlineFieldClick(
          sectionId,
          fieldId,
          event.currentTarget as HTMLElement,
        );
      }
    },
    role: "button",
    tabIndex: 0,
    "aria-label": `Edit ${fieldId}`,
  };
};

export const getCursorPointer = (isEditMode: boolean = false) => {
  return isEditMode ? "pointer" : "inherit";
};

// Utility function to generate inline field props for all fields in a section, based on a common prefix and an array of field names. This helps reduce boilerplate when creating inline editable fields for sections with multiple fields (like personalInfo).
export const getCreatedInlineFields = <TField extends string>(
  sectionId: ResumeEditableSection,
  prefixField: string,
  arr: readonly TField[],
  onInlineFieldClick:
    | ((
        section: ResumeEditableSection,
        fieldId: InlineEditableFieldId,
        anchor?: HTMLElement,
      ) => void)
    | undefined,
): Record<TField, ReturnType<typeof createInlineFieldProps>> => {
  const inlineFields = {} as Record<
    TField,
    ReturnType<typeof createInlineFieldProps>
  >;

  for (const field of arr) {
    // This is a bit of a TypeScript hack to ensure the fieldId is correctly typed as InlineEditableFieldId
    inlineFields[field] = createInlineFieldProps(
      sectionId,
      `${prefixField}.${field}` as InlineEditableFieldId,
      onInlineFieldClick,
    );
  }

  return inlineFields;
};

/**
 * Shared `ICON_MAP`-based icon-picker grid: renders one small `IconButton`
 * per entry in `ICON_NAMES`, highlighting whichever key equals
 * `selectedKey` and invoking `onSelect(key)` on click. Used by the several
 * near-identical toolbox branches in SecretResumeEditor (skills category
 * icon, skills category icon within the comprehensive form, services card
 * icon, services card icon within the comprehensive form) that only differ
 * in which field the picked key is written back to. Not used by the
 * social-link icon picker, which additionally disables icons already used
 * by another social entry — a genuinely different behavior kept inline.
 */
export const renderIconMapPickerGrid = (
  selectedKey: string | undefined,
  onSelect: (key: string) => void,
) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {ICON_NAMES.map((key) => {
      const Ic = ICON_MAP[key];
      const isSelected = selectedKey === key;
      return (
        <IconButton
          key={key}
          size="small"
          onClick={() => onSelect(key)}
          sx={{
            border: isSelected ? "2px solid" : "1px solid transparent",
            borderColor: isSelected ? "primary.main" : "transparent",
            borderRadius: 1,
          }}
          title={key}
        >
          <Ic fontSize="small" />
        </IconButton>
      );
    })}
  </Box>
);
