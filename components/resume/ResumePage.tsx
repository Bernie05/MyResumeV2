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

interface ResumePageProps {
  resume: ResumeData;
  position?: NavbarPosition;
  interactiveSections?: boolean;
  activeSectionId?: ResumeEditableSection | null;
  onSectionClick?: (section: ResumeEditableSection) => void;
  activeInlineFieldId?: InlineEditableFieldId | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (action: string) => void;
}

const ResumePage = ({
  resume,
  position = "sticky",
  // This is used in SecretResumeEditor to enable click interactions on sections and fields
  interactiveSections = false,
  activeSectionId = null,
  activeInlineFieldId = null,
  onSectionClick,
  onInlineFieldClick,
  onAddAction,
  onDeleteAction,
}: ResumePageProps) => {
  const { isDarkMode } = useThemeContext();

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && Boolean(session);

  const getSectionSx = (sectionId: ResumeEditableSection) => {
    if (!interactiveSections) {
      return undefined;
    }

    const isActive = activeSectionId === sectionId;

    return {
      position: "relative",
      cursor: "pointer",
      borderRadius: 2,
      transition: "outline-color 180ms ease, box-shadow 180ms ease",
      outline: isActive ? "2px solid #14b8a6" : "1px dashed transparent",
      outlineOffset: 4,
      "&:hover": {
        outlineColor: isActive ? "#14b8a6" : "rgba(20, 184, 166, 0.5)",
        boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.14)",
      },
    };
  };

  const handleSectionClick = (sectionId: ResumeEditableSection) => {
    onSectionClick?.(sectionId);
  };

  const createSectionProps = (sectionId: ResumeEditableSection) => {
    if (!interactiveSections) {
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
    if (!interactiveSections) return {};

    return {
      isEditMode: interactiveSections,
      onInlineFieldClick,
      activeInlineFieldId,
      onAddAction,
      onDeleteAction,
    };
  };

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} position={position} />

      {/* Hero Section */}
      <Box
        component="section"
        id="about"
        sx={getSectionSx("about")}
        {...createSectionProps("about")}
      >
        <HeroSection
          personalInfo={resume.personalInfo}
          stats={resume.stats}
          {...getEditableProps()}
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
            sx={getSectionSx("services")}
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
            <Portfolio portfolio={resume.portfolio} {...getEditableProps()} />
          </Box>

          {/* Projects Section */}
          <Box
            sx={getSectionSx("projects")}
            {...createSectionProps("projects")}
          >
            <Projects projects={resume.projects} {...getEditableProps()} />
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
