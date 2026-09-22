import type { ResumeData } from "@/types/resume";

import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { EditorSection } from "../SecretResumeEditor";

export const EDITOR_SECTIONS = [
  { value: "personalInfo", label: "Personal Info" },
  { value: "stats", label: "Stats" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
  { value: "portfolio", label: "Portfolio" },
  { value: "certifications", label: "Certifications" },
  { value: "testimonials", label: "Testimonials" },
  { value: "characterReferences", label: "Character References" },
] as const;

export type InlineEditableFieldId =
  | `${string}.${number}` // generic field
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
  | `projects.${number}.technologies.${number}`
  | `projects.${number}.link`
  | `projects.${number}.demoUrl`
  | `projects.${number}.caseStudy`
  | `portfolio.${number}.name`
  | `portfolio.${number}.description`
  | `portfolio.${number}.image`
  | `portfolio.${number}.longDescription`
  | `portfolio.${number}.category`
  | `portfolio.${number}.technologies`
  | `portfolio.${number}.technologies.${number}`
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
  | `services.${number}.title`
  | `services.${number}.icon`
  | `services.${number}.subtitle`
  | `services.${number}.${number}.name`
  | `services.${number}.${number}.icon`
  | `services.${number}.${number}.proficiency`
  | `certifications.${number}.name`
  | `certifications.${number}.issuer`
  | `certifications.${number}.year`
  | `testimonials.${number}.quote`
  | `testimonials.${number}.authorName`
  | `testimonials.${number}.authorRole`
  | `testimonials.${number}.authorCompany`
  | `testimonials.${number}.photoUrl`
  | `characterReferences.${number}.name`
  | `characterReferences.${number}.company`
  | `characterReferences.${number}.position`
  | `characterReferences.${number}.contactNo`
  | "servicesBadge"
  | "servicesTitle"
  | "servicesSubtitle"
  | "experienceBadge"
  | "experienceTitle"
  | "portfolioBadge"
  | "portfolioTitle"
  | "portfolioSubtitle"
  | "projectsBadge"
  | "projectsTitle"
  | "projectsSubtitle"
  | "educationBadge"
  | "educationTitle"
  | "skillsBadge"
  | "skillsTitle"
  | "skillsSubtitle"
  | "certificationsBadge"
  | "certificationsTitle"
  | "testimonialsBadge"
  | "testimonialsTitle"
  | "characterReferencesBadge"
  | "characterReferencesTitle"
  | "contactBadge"
  | "contactTitle"
  | "contactSubtitle";

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
  servicesBadge: "Services Badge",
  servicesTitle: "Services Title",
  servicesSubtitle: "Services Subtitle",
  experienceBadge: "Experience Badge",
  experienceTitle: "Experience Title",
  portfolioBadge: "Portfolio Badge",
  portfolioTitle: "Portfolio Title",
  portfolioSubtitle: "Portfolio Subtitle",
  projectsBadge: "Projects Badge",
  projectsTitle: "Projects Title",
  projectsSubtitle: "Projects Subtitle",
  educationBadge: "Education Badge",
  educationTitle: "Education Title",
  skillsBadge: "Skills Badge",
  skillsTitle: "Skills Title",
  skillsSubtitle: "Skills Subtitle",
  certificationsBadge: "Certifications Badge",
  certificationsTitle: "Certifications Title",
  testimonialsBadge: "Testimonials Badge",
  testimonialsTitle: "Testimonials Title",
  characterReferencesBadge: "Character References Badge",
  characterReferencesTitle: "Character References Title",
  contactBadge: "Contact Badge",
  contactTitle: "Contact Title",
  contactSubtitle: "Contact Subtitle",
};

// The 11 top-level "Badge"/"Title"/"Subtitle" fields (servicesBadge,
// experienceTitle, portfolioSubtitle, etc.) are each a single plain string on
// ResumeData, rendered as one TextField with a label + placeholder that
// writes straight back to `draft.<field>`. This table drives a single shared
// branch in SecretResumeEditor's renderInlineFieldToolbox instead of one
// near-identical `if` per field.
export const SIMPLE_TEXT_FIELD_CONFIG: Partial<
  Record<
    InlineEditableFieldId,
    { label: string; placeholder: string; field: keyof ResumeData }
  >
> = {
  servicesBadge: {
    label: "Services Badge",
    placeholder: "Services",
    field: "servicesBadge",
  },
  servicesTitle: {
    label: "Services Title",
    placeholder: "What I Offer",
    field: "servicesTitle",
  },
  servicesSubtitle: {
    label: "Services Subtitle",
    placeholder: "Professional services tailored to your project needs",
    field: "servicesSubtitle",
  },
  experienceBadge: {
    label: "Experience Badge",
    placeholder: "Experience",
    field: "experienceBadge",
  },
  experienceTitle: {
    label: "Experience Title",
    placeholder: "Professional Experience",
    field: "experienceTitle",
  },
  portfolioBadge: {
    label: "Portfolio Badge",
    placeholder: "Portfolio",
    field: "portfolioBadge",
  },
  portfolioTitle: {
    label: "Portfolio Title",
    placeholder: "Featured Work",
    field: "portfolioTitle",
  },
  portfolioSubtitle: {
    label: "Portfolio Subtitle",
    placeholder:
      "Explore my best projects and case studies. Each project showcases strategic problem-solving and technical excellence.",
    field: "portfolioSubtitle",
  },
  projectsBadge: {
    label: "Projects Badge",
    placeholder: "Projects",
    field: "projectsBadge",
  },
  projectsTitle: {
    label: "Projects Title",
    placeholder: "Recent Projects",
    field: "projectsTitle",
  },
  projectsSubtitle: {
    label: "Projects Subtitle",
    placeholder: "Latest work and technical achievements",
    field: "projectsSubtitle",
  },
  educationBadge: {
    label: "Education Badge",
    placeholder: "Education",
    field: "educationBadge",
  },
  educationTitle: {
    label: "Education Title",
    placeholder: "Education",
    field: "educationTitle",
  },
  skillsBadge: {
    label: "Skills Badge",
    placeholder: "Skills",
    field: "skillsBadge",
  },
  skillsTitle: {
    label: "Skills Title",
    placeholder: "Professional Skills",
    field: "skillsTitle",
  },
  skillsSubtitle: {
    label: "Skills Subtitle",
    placeholder: "Expertise across technologies and platforms",
    field: "skillsSubtitle",
  },
  certificationsBadge: {
    label: "Certifications Badge",
    placeholder: "Certifications",
    field: "certificationsBadge",
  },
  certificationsTitle: {
    label: "Certifications Title",
    placeholder: "Certifications",
    field: "certificationsTitle",
  },
  testimonialsBadge: {
    label: "Testimonials Badge",
    placeholder: "Testimonials",
    field: "testimonialsBadge",
  },
  testimonialsTitle: {
    label: "Testimonials Title",
    placeholder: "What People Say",
    field: "testimonialsTitle",
  },
  characterReferencesBadge: {
    label: "Character References Badge",
    placeholder: "Character References",
    field: "characterReferencesBadge",
  },
  characterReferencesTitle: {
    label: "Character References Title",
    placeholder: "People Who Vouch For Me",
    field: "characterReferencesTitle",
  },
  contactBadge: {
    label: "Contact Badge",
    placeholder: "Contact Info",
    field: "contactBadge",
  },
  contactTitle: {
    label: "Contact Title",
    placeholder: "Get In Touch",
    field: "contactTitle",
  },
  contactSubtitle: {
    label: "Contact Subtitle",
    placeholder:
      "Reach out for collaboration, consulting, or product work. If you have a project in mind, send the details through the inquiry form and I can get back to you with the best next step.",
    field: "contactSubtitle",
  },
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
  testimonials: "testimonials",
  characterReferences: "characterReferences",
  contact: "personalInfo",
  stats: "stats",
};
