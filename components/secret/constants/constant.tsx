import type { ResumeData } from "@/types/resume";

import { ResumeEditableSection } from "@/components/resume/ResumePage";
import { EditorSection } from "../SecretResumeEditor";

export const EDITOR_SECTIONS = [
  { value: "personalInfo", label: "Personal Info" },
  { value: "stats", label: "Stats" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
  { value: "portfolio", label: "Portfolio" },
  { value: "certifications", label: "Certifications" },
] as const;

export type InlineEditableFieldId =
  | `personalInfo.${keyof ResumeData["personalInfo"]}`
  | `personalInfo.hireButtonText`
  | `personalInfo.downloadButtonText`
  | `personalInfo.social.${string}`
  | `stats.${keyof ResumeData["stats"]}`
  | `stats.custom.${number}`
  | `experience.${number}.company`
  | `experience.${number}.position`
  | `experience.${number}.duration`
  | `experience.${number}.location`
  | `experience.${number}.description.${number}`
  | `projects.${number}.name`
  | `projects.${number}.description`
  | `projects.${number}.image`
  | `projects.${number}.technologies`
  | `projects.${number}.link`
  | `projects.${number}.demoUrl`
  | `projects.${number}.caseStudy`
  | `portfolio.${number}.name`
  | `portfolio.${number}.description`
  | `portfolio.${number}.image`
  | `portfolio.${number}.longDescription`
  | `portfolio.${number}.category`
  | `portfolio.${number}.technologies`
  | `portfolio.${number}.demoUrl`
  | `portfolio.${number}.githubUrl`
  | `portfolio.${number}.testimonial`
  | `portfolio.${number}.client`
  | `portfolio.${number}.result.${number}`
  | `education.${number}.school`
  | `education.${number}.degree`
  | `education.${number}.year`
  | `education.${number}.location`
  | `skills.${number}.category`
  | `skills.${number}.icon`
  | `skills.${number}.subtitle`
  | `skills.${number}.${number}.name`
  | `skills.${number}.${number}.icon`
  | `skills.${number}.${number}.proficiency`
  | `certifications.${number}.name`
  | `certifications.${number}.issuer`
  | `certifications.${number}.year`
  | "servicesTitle"
  | "servicesSubtitle";

export const INLINE_FIELD_LABELS: Partial<
  Record<InlineEditableFieldId, string>
> = {
  "personalInfo.name": "Name",
  "personalInfo.title": "Title",
  "personalInfo.summary": "Summary",
  "personalInfo.email": "Email",
  "personalInfo.phone": "Phone",
  "personalInfo.location": "Location",
  "personalInfo.website": "Website",
  "personalInfo.linkedin": "LinkedIn",
  "personalInfo.github": "GitHub",
  "personalInfo.photoUrl": "Photo URL",
  "personalInfo.backgroundUrl": "Background Image URL",
  "personalInfo.hireButtonText": "Hire Button Text",
  "personalInfo.downloadButtonText": "Download Button Text",
  "stats.yearsExperience": "Years of experience",
  "stats.projects": "Completed projects",
  "stats.clients": "Clients",
  "stats.awards": "Awards",
  servicesTitle: "Services Title",
  servicesSubtitle: "Services Subtitle",
};

export const PREVIEW_SECTION_TO_EDITOR_SECTION: Record<
  ResumeEditableSection,
  EditorSection
> = {
  about: "personalInfo",
  services: "skills",
  experience: "experience",
  portfolio: "portfolio",
  projects: "projects",
  education: "education",
  skills: "skills",
  certifications: "certifications",
  contact: "personalInfo",
};
