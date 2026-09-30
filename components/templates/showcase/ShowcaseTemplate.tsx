"use client";

import { Fragment, useEffect, type ReactNode } from "react";
import { Box } from "@mui/material";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { ResumeTemplateProps } from "../index";
import { archivo } from "./tokens";
import { EDIT_ACCENT_VAR } from "@/theme/editAccent";
import { HiddenSectionsProvider } from "../shared/sectionVisibility";
import { SectionOrderProvider, resolveSectionOrder } from "../shared/sectionOrder";
import { useShowcasePalette } from "./primitives";
import { ShowcaseHero, ShowcaseNav } from "./ShowcaseHero";
import { ShowcasePortfolio, ShowcaseProjects } from "./ShowcaseWork";
import {
  ShowcaseCredentials,
  ShowcaseExperience,
  ShowcaseServices,
  ShowcaseSkills,
} from "./ShowcaseCareer";
import { ShowcaseReferences, ShowcaseTestimonials } from "./ShowcasePeople";
import { ShowcaseContact } from "./ShowcaseContact";

/** Sections in the order Design 2 renders them by default. */
export const SHOWCASE_SECTIONS: readonly ResumeEditableSection[] = [
  "about", "projects", "portfolio", "experience", "skills", "services", "education", "certifications", "testimonials", "characterReferences", "contact",
];

// Design 2: bold editorial showcase. Same ResumeData and edit IDs as Design 1;
// only the presentation differs.
const ShowcaseTemplate = ({ resume, position = "sticky" }: ResumeTemplateProps) => {
  const palette = useShowcasePalette();

  // Paint the canvas (overscroll, rubber-banding) with the design's paper color
  // instead of the global light/dark page background.
  useEffect(() => {
    const html = document.documentElement;
    html.style.backgroundColor = palette.paper;
    return () => {
      html.style.backgroundColor = "";
    };
  }, [palette.paper]);

  const order = resolveSectionOrder(resume, SHOWCASE_SECTIONS);
  const sections: Partial<Record<ResumeEditableSection, ReactNode>> = {
    about: <ShowcaseHero resume={resume} />,
    projects: <ShowcaseProjects resume={resume} />,
    portfolio: <ShowcasePortfolio resume={resume} />,
    experience: <ShowcaseExperience resume={resume} />,
    skills: <ShowcaseSkills resume={resume} />,
    services: <ShowcaseServices resume={resume} />,
    testimonials: <ShowcaseTestimonials resume={resume} />,
    characterReferences: <ShowcaseReferences resume={resume} />,
    contact: <ShowcaseContact resume={resume} />,
  };
  // Education and certifications share a two-column row only while adjacent in the order
  const paired = Math.abs(order.indexOf("education") - order.indexOf("certifications")) === 1;
  const firstCredential = order.find((id) => id === "education" || id === "certifications");
  (["education", "certifications"] as const).forEach((id) => {
    sections[id] = !paired ? (
      <ShowcaseCredentials resume={resume} only={id} />
    ) : id === firstCredential ? (
      <ShowcaseCredentials
        resume={resume}
        certificationsFirst={order.indexOf("certifications") < order.indexOf("education")}
      />
    ) : null;
  });

  return (
    <HiddenSectionsProvider resume={resume}>
    <SectionOrderProvider order={order}>
    <Box
      className={archivo.className}
      sx={{
        minHeight: "100dvh",
        [EDIT_ACCENT_VAR]: palette.accent,
        backgroundColor: palette.paper,
        color: palette.ink,
        "& .MuiTypography-root": { fontFamily: "inherit" },
        "& ::selection": { backgroundColor: palette.accent, color: palette.onAccent },
        "& a, & button, & [role='button']": { WebkitTapHighlightColor: "transparent" },
      }}
    >
      <ShowcaseNav resume={resume} position={position} />
      <Box component="main">
        {order.map((id) => (
          <Fragment key={id}>{sections[id]}</Fragment>
        ))}
      </Box>
    </Box>
    </SectionOrderProvider>
    </HiddenSectionsProvider>
  );
};

export default ShowcaseTemplate;
