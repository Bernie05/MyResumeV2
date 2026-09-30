"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { ResumeData } from "@/types/resume";

// The hero ("about") anchors the page and can't be hidden.
export const isSectionHideable = (id: ResumeEditableSection) => id !== "about";

export const isSectionHidden = (
  resume: Pick<ResumeData, "hiddenSections">,
  id: ResumeEditableSection,
) => isSectionHideable(id) && Boolean(resume.hiddenSections?.includes(id));

// Templates wrap their root in this so EditableSection (public: not rendered,
// editor: dimmed) needs no per-section prop.
const HiddenSectionsContext = createContext<readonly ResumeEditableSection[]>([]);

export const HiddenSectionsProvider = ({
  resume,
  children,
}: {
  resume: Pick<ResumeData, "hiddenSections">;
  children: ReactNode;
}) => (
  <HiddenSectionsContext.Provider value={resume.hiddenSections ?? []}>
    {children}
  </HiddenSectionsContext.Provider>
);

export const useHiddenSections = () => useContext(HiddenSectionsContext);

export const useIsSectionHidden = (id: ResumeEditableSection) => {
  const hidden = useHiddenSections();
  return isSectionHideable(id) && hidden.includes(id);
};
