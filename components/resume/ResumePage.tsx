"use client";

import Navbar from "@/components/resume/Navbar";
import HeroSection from "@/components/resume/HeroSection";
import ServicesSection from "@/components/resume/ServicesSection";
import Experience from "@/components/resume/Experience";
import Education from "@/components/resume/Education";
import Skills from "@/components/resume/Skills";
import Portfolio from "@/components/resume/Portfolio";
import Projects from "@/components/resume/Projects";
import Certifications from "@/components/resume/Certifications";
import { useThemeContext } from "@/context/ThemeContext";
import type { ResumeData } from "@/types/resume";
import { Box, Container, Stack, Typography } from "@mui/material";
import { getSectionPalette } from "@/theme/sectionPalette";
import { ContactSection } from "./ContactSection";
import { useSession } from "next-auth/react";
import { InlineEditableFieldId } from "../secret/constants/constant";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { isAuthenticated } from "./util/authUtil";

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
  | "contact"
  | "stats";

interface IResumePageProps extends IEditorProps {
  resume: ResumeData;
  position?: NavbarPosition;
  interactiveSections?: boolean;
}

const ResumePage = ({ resume, position, editorProps }: IResumePageProps) => {
  const {
    activeSectionId,
    onSectionClick,
    activeInlineFieldId,
    onInlineFieldClick,
    onAddAction,
    onDeleteAction,
  } = editorProps || {};

  const { isEditMode } = editorProps || {};
  const { isDarkMode } = useThemeContext();

  const { data: session, status } = useSession();
  const hasAccess = isAuthenticated(status, session);

  const handleSectionClick = (sectionId: ResumeEditableSection) => {
    onSectionClick?.(sectionId);
  };

  // we need to transfer this
  const createSectionProps = (sectionId: ResumeEditableSection) => {
    if (!isEditMode) {
      return {};
    }

    return {
      role: "button",
      tabIndex: 0,
      "aria-label": `Edit ${sectionId} section`,
      onClick: () => handleSectionClick(sectionId),
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSectionClick(sectionId);
        }
      },
    };
  };

  const getEditableProps = () => {
    if (!isEditMode) return {};

    // I think we can do this as useHook (activeInlineFieldId)
    return {
      isEditMode,
      onInlineFieldClick,
      activeInlineFieldId,
      onAddAction,
      onDeleteAction,
    };
  };

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar isAuthenticated={hasAccess} position={position!} />

      {/* Hero Section */}
      <Box
        id="about"
        component="section"
        sx={getSectionSx(isEditMode, activeSectionId, "about")}
        {...createSectionProps("about")}
      >
        <HeroSection
          personalInfo={resume.personalInfo}
          stats={resume.stats}
          {...getEditableProps()}
          editorProps={editorProps}
        />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 10, md: 14 }}>
          {/* Services Section */}
          <Box
            sx={getSectionSx(isEditMode, activeSectionId, "services")}
            {...createSectionProps("services")}
          >
            <ServicesSection
              skills={resume.skills}
              servicesTitle={resume.servicesTitle}
              servicesSubtitle={resume.servicesSubtitle}
              {...getEditableProps()}
            />
          </Box>

          {/* Experience Section */}
          <Box
            component="section"
            id="experience"
            sx={getSectionSx("experience")}
            {...createSectionProps("experience")}
          >
            <Experience
              experience={resume.experience}
              {...getEditableProps()}
            />
          </Box>

          {/* Portfolio Section */}
          <Box
            component="section"
            id="portfolio"
            sx={getSectionSx("portfolio")}
            {...createSectionProps("portfolio")}
          >
            <Portfolio
              portfolio={resume.portfolio}
              editorProps={editorProps}
              {...getEditableProps()}
            />
          </Box>

          {/* Projects Section */}
          <Box
            sx={getSectionSx("projects")}
            {...createSectionProps("projects")}
          >
            <Projects
              projects={resume.projects}
              editorProps={editorProps}
              {...getEditableProps()}
            />
          </Box>
          <Box
            sx={getSectionSx("education")}
            {...createSectionProps("education")}
          >
            <Education education={resume.education} {...getEditableProps()} />
          </Box>

          {/* Skills Section */}
          <Box
            component="section"
            id="skills"
            sx={getSectionSx("skills")}
            {...createSectionProps("skills")}
          >
            <Skills skills={resume.skills} {...getEditableProps()} />
          </Box>

          {/* Certifications Section */}
          <Box
            sx={getSectionSx("certifications")}
            {...createSectionProps("certifications")}
          >
            <Certifications
              certifications={resume.certifications}
              {...getEditableProps()}
            />
          </Box>

          {/* Contact Section */}
          <Box
            component="section"
            id="contact"
            sx={getSectionSx("contact")}
            {...createSectionProps("contact")}
          >
            <ContactSection
              personalInfo={resume.personalInfo}
              {...getEditableProps()}
            />
          </Box>

          {/* Footer Section */}
          <Box
            component="footer"
            id="footer"
            sx={{
              textAlign: "center",
              py: 8,
              mt: 10,
              borderTop: "1px solid",
              borderColor: isDarkMode
                ? "rgba(71, 85, 105, 0.55)"
                : "rgba(203, 213, 225, 0.9)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "#94a3b8" : "#64748b",
              }}
            >
              {new Date().getFullYear()} © {resume.personalInfo.name}. All
              rights reserved.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResumePage;
