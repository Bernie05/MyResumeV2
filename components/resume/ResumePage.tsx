"use client";

import Navbar from "@/components/Navbar";
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

export type NavbarPosition =
  | "fixed"
  | "absolute"
  | "sticky"
  | "static"
  | "relative";

interface ResumePageProps {
  resume: ResumeData;
  position?: NavbarPosition;
}

const ResumePage = ({ resume, position = "sticky" }: ResumePageProps) => {
  const { isDarkMode } = useThemeContext();
  const theme = getSectionPalette(isDarkMode);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && Boolean(session);
  console.log("theme", theme);

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar
        theme={theme}
        isDarkMode={isDarkMode}
        isAuthenticated={isAuthenticated}
        position={position}
      />

      {/* Hero Section */}
      <Box component="section" id="about">
        <HeroSection personalInfo={resume.personalInfo} stats={resume.stats} />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 10, md: 14 }}>
          {/* Services Section */}
          <ServicesSection skills={resume.skills} />

          {/* Experience Section */}
          <Box component="section" id="experience">
            <Experience experience={resume.experience} />
          </Box>

          {/* Portfolio Section */}
          <Box component="section" id="portfolio">
            <Portfolio portfolio={resume.portfolio} />
          </Box>

          {/* Projects Section */}
          <Projects projects={resume.projects} />
          <Education education={resume.education} />

          {/* Skills Section */}
          <Box component="section" id="skills">
            <Skills skills={resume.skills} />
          </Box>

          {/* Certifications Section */}
          <Certifications certifications={resume.certifications} />

          {/* Contact Section */}
          <Box component="section" id="contact">
            <ContactSection
              theme={theme}
              isDarkMode={isDarkMode}
              personalInfo={resume.personalInfo}
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
