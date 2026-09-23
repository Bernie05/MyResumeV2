"use client";

import type { ElementType, ReactNode } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
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
import {
  useEditor,
  useIsEditMode,
  useOnSectionClick,
} from "../../hook/useEditor";
import { createSectionProps } from "../secret/utils/componentUtil";
import { isAuthenticated } from "./util/authUtil";
import Footer from "./components/footer";

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
  const isEditMode = useIsEditMode();
  const activeSectionId = editor?.activeSection;
  const onSectionClick = useOnSectionClick();

  const { isDarkMode } = useThemeContext();
  const sectionsAreInteractive = interactiveSections ?? Boolean(isEditMode);

  const { data: session, status } = useSession();
  const hasAccess = isAuthenticated(status, session);

  // Function to get the styles for each section based on its active states
  const getSectionSx = (sectionId: ResumeEditableSection) => {
    const isActiveSection = activeSectionId === sectionId;

    return {
      borderRadius: sectionsAreInteractive ? { xs: 4, md: 5 } : undefined,
      outline:
        sectionsAreInteractive && isActiveSection
          ? "2px solid rgba(20, 184, 166, 0.9)"
          : "2px solid transparent",
      outlineOffset: 8,
      scrollMarginTop: { xs: 88, md: 104 },
      transition: "outline-color 160ms ease, box-shadow 160ms ease",
      "&:hover": sectionsAreInteractive
        ? {
            outlineColor: "rgba(20, 184, 166, 0.55)",
            boxShadow: isActiveSection
              ? "0 0 0 6px rgba(20, 184, 166, 0.2)"
              : "0 0 0 4px rgba(20, 184, 166, 0.12)",
          }
        : undefined,
    };
  };

  // Function to render each section with its respective props and styles
  const renderSection = ({
    children,
    sectionId,
    component = "div",
    domId = sectionId,
  }: PreviewSectionProps) => {
    return (
      <Box
        id={domId}
        component={component}
        sx={getSectionSx(sectionId)}
        // Editable section props for interactivity in edit mode
        {...createSectionProps(
          sectionsAreInteractive,
          sectionId,
          onSectionClick,
        )}
      >
        {children}
      </Box>
    );
  };

  const footerBorderColor = isDarkMode
    ? "rgba(71, 85, 105, 0.55)"
    : "rgba(203, 213, 225, 0.9)";

  const footerTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      <Navbar isAuthenticated={hasAccess} position={position} />

      {/* About Section */}
      {renderSection({
        sectionId: "about",
        component: "section",
        children: (
          <HeroSection
            personalInfo={resume.personalInfo}
            stats={resume.stats}
          />
        ),
      })}

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        {/* Section Stack */}
        <Stack spacing={{ xs: 10, md: 14 }}>
          {renderSection({
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
          })}

          {/* Experience Section */}
          {renderSection({
            sectionId: "experience",
            component: "section",
            children: (
              <Experience
                experience={resume.experience}
                experienceBadge={resume.experienceBadge}
                experienceTitle={resume.experienceTitle}
              />
            ),
          })}

          {/* Portfolio Section */}
          {renderSection({
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
          })}

          {/*  */}
          {renderSection({
            sectionId: "projects",
            children: (
              <Projects
                projects={resume.projects}
                projectsBadge={resume.projectsBadge}
                projectsTitle={resume.projectsTitle}
                projectsSubtitle={resume.projectsSubtitle}
              />
            ),
          })}

          {/* Education Section */}
          {renderSection({
            sectionId: "education",
            children: (
              <Education
                education={resume.education}
                educationBadge={resume.educationBadge}
                educationTitle={resume.educationTitle}
              />
            ),
          })}

          {/* Skills Section */}
          {renderSection({
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
          })}

          {/* Certifications Section */}
          {renderSection({
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
          })}

          {/* Testimonials Section */}
          {renderSection({
            sectionId: "testimonials",
            children: (
              <Testimonials
                testimonials={resume.testimonials}
                testimonialsBadge={resume.testimonialsBadge}
                testimonialsTitle={resume.testimonialsTitle}
              />
            ),
          })}

          {/* Character References Section */}
          {renderSection({
            sectionId: "characterReferences",
            children: (
              <CharacterReferences
                characterReferences={resume.characterReferences}
                characterReferencesBadge={resume.characterReferencesBadge}
                characterReferencesTitle={resume.characterReferencesTitle}
              />
            ),
          })}

          {/* Contact Section */}
          {renderSection({
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
          })}

          {/* Footer */}
          <Box
            component="footer"
            id="footer"
            sx={{
              textAlign: "center",
              py: 8,
              mt: 10,
              borderTop: "1px solid",
              borderColor: footerBorderColor,
            }}
          >
            {Footer(resume, { color: footerTextColor })}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResumePage;
