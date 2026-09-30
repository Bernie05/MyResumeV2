"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { ResumeData } from "@/types/resume";

// The hero opens the page and contact closes it (footer follows); only the
// sections between them can be reordered.
export const FIRST_SECTION: ResumeEditableSection = "about";
export const LAST_SECTION: ResumeEditableSection = "contact";
export const isSectionMovable = (id: ResumeEditableSection) =>
  id !== FIRST_SECTION && id !== LAST_SECTION;

/**
 * The order a template renders: the saved `sectionOrder` merged with the
 * template's defaults. Ids the template doesn't have are dropped; sections
 * missing from the saved order (older drafts, template switches) are inserted
 * after their default predecessor, so nothing is ever lost.
 */
export const resolveSectionOrder = (
  resume: Pick<ResumeData, "sectionOrder">,
  defaults: readonly ResumeEditableSection[],
): ResumeEditableSection[] => {
  const movableDefaults: ResumeEditableSection[] = defaults.filter(isSectionMovable);
  const middle: ResumeEditableSection[] = [...new Set(resume.sectionOrder ?? [])].filter((id) => movableDefaults.includes(id));
  movableDefaults.forEach((id, i) => {
    if (middle.includes(id)) return;
    middle.splice(middle.indexOf(movableDefaults[i - 1]) + 1, 0, id);
  });
  return [
    ...(defaults.includes(FIRST_SECTION) ? [FIRST_SECTION] : []),
    ...middle,
    ...(defaults.includes(LAST_SECTION) ? [LAST_SECTION] : []),
  ];
};

// Lets nav components follow the order without knowing the template's defaults.
const SectionOrderContext = createContext<readonly ResumeEditableSection[]>([]);

export const SectionOrderProvider = ({
  order,
  children,
}: {
  order: readonly ResumeEditableSection[];
  children: ReactNode;
}) => <SectionOrderContext.Provider value={order}>{children}</SectionOrderContext.Provider>;

export const useSectionOrder = () => useContext(SectionOrderContext);
