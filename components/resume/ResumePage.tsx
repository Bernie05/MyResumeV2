"use client";

import { Fragment, type ElementType, type ReactNode } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import { downloadResumePdf } from "./pdf/downloadResumePdf";
import ServicesSection from "./ServicesSection";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Portfolio from "./Portfolio";
import Projects from "./Projects";
import Certifications from "./Certifications";
import Testimonials from "./Testimonials";
import CharacterReferences from "./CharacterReferences";
import { useThemeContext } from "../../context/ThemeContext";
import type { ResumeData } from "../../types/resume";
import { Box, Container, Stack, Typography } from "@mui/material";
import { ContactSection } from "./ContactSection";
import { useSession } from "next-auth/react";
import { useEditor } from "../../hook/useEditor";
import { EditableSection } from "../templates/shared/EditableSection";
import { isAuthenticated } from "./util/authUtil";
import Footer from "./components/footer";
import { archivo } from "@/theme/fonts";
import { getSectionPalette } from "@/theme/sectionPalette";
import { EDIT_ACCENT_VAR } from "@/theme/editAccent";
import { HiddenSectionsProvider } from "../templates/shared/sectionVisibility";
import { SectionOrderProvider, resolveSectionOrder } from "../templates/shared/sectionOrder";

export type NavbarPosition =
  | "fixed"
  | "absolute"
  | "sticky"
  | "static"
  | "relative";

export type ResumeEditableSection =
  | "about"
  | "services"
  | "experience"
  | "portfolio"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "testimonials"
  | "characterReferences"
  | "contact"
  | "stats";

/** Sections in the order Design 1 renders them by default. */
export const RESUME_PAGE_SECTIONS: readonly ResumeEditableSection[] = [
  "about", "services", "experience", "portfolio", "projects", "education", "skills", "certifications", "testimonials", "characterReferences", "contact",
];

interface IResumePageProps {
  resume: ResumeData;
  position?: NavbarPosition;
  interactiveSections?: boolean;
}

interface PreviewSectionProps {
  children: ReactNode;
  sectionId: ResumeEditableSection;
  component?: ElementType;
  domId?: string;
}

const ResumePage = ({
  resume,
  position = "sticky",
  interactiveSections,
}: IResumePageProps) => {
  const editor = useEditor();

  const { isDarkMode } = useThemeContext();

  const { data: session, status } = useSession();
  const hasAccess = isAuthenticated(status, session);

  // Each top-level section is clickable/outlined in edit mode
  const renderSection = ({
    children,
    sectionId,
    component = "div",
    domId = sectionId,
  }: PreviewSectionProps) => (
    <EditableSection
      sectionId={sectionId}
      component={component}
      domId={domId}
      interactive={interactiveSections}
    >
      {children}
    </EditableSection>
  );

  // Design 1 defaults come from RESUME_PAGE_SECTIONS; a saved sectionOrder reorders the middle.
  const order = resolveSectionOrder(resume, RESUME_PAGE_SECTIONS);

  const sections: Partial<Record<ResumeEditableSection, ReactNode>> = {
    about: renderSection({
      sectionId: "about",
      component: "section",
      children: (
        <HeroSection
          personalInfo={resume.personalInfo}
          stats={resume.stats}
          onDownloadCv={() => downloadResumePdf(resume)}
        />
      ),
    }),
    services: renderSection({
      sectionId: "services",
      children: (
        <ServicesSection
          services={resume.services}
          servicesBadge={resume.servicesBadge}
          servicesTitle={resume.servicesTitle}
          servicesSubtitle={resume.servicesSubtitle}
          onInlineFieldClick={editor?.onInlineFieldClick}
          activeInlineFieldId={editor?.activeInlineFieldId}
          onAddAction={editor?.onAddAction}
          onDeleteAction={editor?.onDeleteAction}
        />
      ),
    }),
    experience: renderSection({
      sectionId: "experience",
      component: "section",
      children: (
        <Experience
          experience={resume.experience}
          experienceBadge={resume.experienceBadge}
          experienceTitle={resume.experienceTitle}
        />
      ),
    }),
    portfolio: renderSection({
      sectionId: "portfolio",
      component: "section",
      children: (
        <Portfolio
          portfolio={resume.portfolio}
          portfolioBadge={resume.portfolioBadge}
          portfolioTitle={resume.portfolioTitle}
          portfolioSubtitle={resume.portfolioSubtitle}
        />
      ),
    }),
    projects: renderSection({
      sectionId: "projects",
      children: (
        <Projects
          projects={resume.projects}
          projectsBadge={resume.projectsBadge}
          projectsTitle={resume.projectsTitle}
          projectsSubtitle={resume.projectsSubtitle}
        />
      ),
    }),
    education: renderSection({
      sectionId: "education",
      children: (
        <Education
          education={resume.education}
          educationBadge={resume.educationBadge}
          educationTitle={resume.educationTitle}
        />
      ),
    }),
    skills: renderSection({
      sectionId: "skills",
      component: "section",
      children: (
        <Skills
          skills={resume.skills}
          skillsBadge={resume.skillsBadge}
          skillsTitle={resume.skillsTitle}
          skillsSubtitle={resume.skillsSubtitle}
          onInlineFieldClick={editor?.onInlineFieldClick}
          activeInlineFieldId={editor?.activeInlineFieldId}
          onDeleteAction={editor?.onDeleteAction}
          onAddAction={editor?.onAddAction}
        />
      ),
    }),
    certifications: renderSection({
      sectionId: "certifications",
      children: (
        <Certifications
          certifications={resume.certifications}
          certificationsBadge={resume.certificationsBadge}
          certificationsTitle={resume.certificationsTitle}
          onInlineFieldClick={editor?.onInlineFieldClick}
          activeInlineFieldId={editor?.activeInlineFieldId}
          onAddAction={editor?.onAddAction}
          onDeleteAction={editor?.onDeleteAction}
        />
      ),
    }),
    testimonials: renderSection({
      sectionId: "testimonials",
      children: (
        <Testimonials
          testimonials={resume.testimonials}
          testimonialsBadge={resume.testimonialsBadge}
          testimonialsTitle={resume.testimonialsTitle}
        />
      ),
    }),
    characterReferences: renderSection({
      sectionId: "characterReferences",
      children: (
        <CharacterReferences
          characterReferences={resume.characterReferences}
          characterReferencesBadge={resume.characterReferencesBadge}
          characterReferencesTitle={resume.characterReferencesTitle}
        />
      ),
    }),
    contact: renderSection({
                    sectionId: "contact",
                    component: "section",
                    children: (
                      <ContactSection
                        personalInfo={resume.personalInfo}
                        contactBadge={resume.contactBadge}
                        contactTitle={resume.contactTitle}
                        contactSubtitle={resume.contactSubtitle}
                        onInlineFieldClick={editor?.onInlineFieldClick}
                        activeInlineFieldId={editor?.activeInlineFieldId}
                      />
                    ),
                  }),
    
  };

  const footerBorderColor = isDarkMode
    ? "rgba(71, 85, 105, 0.55)"
    : "rgba(203, 213, 225, 0.9)";

  const footerTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  const renderOrdered = (ids: ResumeEditableSection[]) =>
    ids.map((id) => <Fragment key={id}>{sections[id]}</Fragment>);

  return (
    <HiddenSectionsProvider resume={resume}>
    <SectionOrderProvider order={order}>
    <Box
      component="main"
      className={archivo.className}
      sx={{
        width: "100%",
        minHeight: "100dvh",
        [EDIT_ACCENT_VAR]: getSectionPalette(isDarkMode).primaryAccent,
        // Shared type family with the other designs
        "& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root": {
          fontFamily: "inherit",
        },
      }}
    >
      <Navbar isAuthenticated={hasAccess} position={position} />

      {/* Hero stays first */}
      {sections.about}

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 6, sm: 8, md: 14 }}>
          {renderOrdered(order.slice(1))}

          {/* Footer */}
          <Box
            component="footer"
            id="footer"
            sx={{
              textAlign: "center",
              py: { xs: 5, md: 8 },
              mt: { xs: 4, md: 10 },
              borderTop: "1px solid",
              borderColor: footerBorderColor,
            }}
          >
            {Footer(resume, { color: footerTextColor })}
          </Box>
        </Stack>
      </Container>
    </Box>
    </SectionOrderProvider>
    </HiddenSectionsProvider>
  );
};

export default ResumePage;
