import type { ComponentType } from "react";
import type { ProjectItem, ResumeData } from "@/types/resume";
import ResumePage, { RESUME_PAGE_SECTIONS, type NavbarPosition, type ResumeEditableSection } from "@/components/resume/ResumePage";
import ShowcaseTemplate, { SHOWCASE_SECTIONS } from "./showcase/ShowcaseTemplate";
import { orderProjectsForDisplay } from "./showcase/ShowcaseWork";
import { getSectionPalette } from "@/theme/sectionPalette";
import { getShowcasePalette } from "./showcase/tokens";

// Every design renders the same ResumeData. To stay editable in /secret, a
// template must emit the existing field/section ids (InlineEditableFieldId,
// ResumeEditableSection) via EditableSection + useEditableItem.
export interface ResumeTemplateProps {
  resume: ResumeData;
  position?: NavbarPosition;
}

interface TemplateEntry {
  label: string;
  /** Preview image in /public shown by the editor's Design picker. */
  thumbnail: string;
  Component: ComponentType<ResumeTemplateProps>;
  /** Selection/hover accent for editor outlines and the popover; also exposed as --edit-accent on the template root. */
  editAccent: (isDarkMode: boolean) => string;
  /** Sections in this design's default order; a saved sectionOrder reorders them (see shared/sectionOrder). */
  sections: readonly ResumeEditableSection[];
  /** Projects in the order this design displays them, with their original indexes (the editor's Projects form follows it). */
  orderProjects: (projects: ProjectItem[]) => { project: ProjectItem; index: number }[];
}

export const templates = {
  default: {
    label: "Design 1: Classic",
    thumbnail: "/templates/default.jpg",
    Component: ResumePage,
    editAccent: (dark) => getSectionPalette(dark).primaryAccent,
    sections: RESUME_PAGE_SECTIONS,
    orderProjects: (projects) => projects.map((project, index) => ({ project, index })),
  },
  showcase: {
    label: "Design 2: Showcase",
    thumbnail: "/templates/showcase.jpg",
    Component: ShowcaseTemplate,
    editAccent: (dark) => getShowcasePalette(dark).accent,
    sections: SHOWCASE_SECTIONS,
    orderProjects: orderProjectsForDisplay,
  },
} satisfies Record<string, TemplateEntry>;

export type TemplateId = keyof typeof templates;

export const templateOptions = Object.entries(templates).map(([id, { label, thumbnail }]) => ({
  id: id as TemplateId,
  label,
  thumbnail,
}));

// Unknown or missing ids (e.g. drafts persisted before `template` existed) fall back to Design 1.
export const resolveTemplate = (id?: string): TemplateEntry =>
  templates[id as TemplateId] ?? templates.default;
