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

type NavbarPosition = "fixed" | "absolute" | "sticky" | "static" | "relative";

interface ResumePageProps {
  resume: ResumeData;
  showNavbar?: boolean;
  navbarPosition?: NavbarPosition;
}

export default function ResumePage({
  resume,
  showNavbar = true,
  navbarPosition = "sticky",
}: ResumePageProps) {
  const { isDarkMode } = useThemeContext();

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      {showNavbar ? <Navbar position={navbarPosition} /> : null}

      <Box component="section" id="about">
        <HeroSection personalInfo={resume.personalInfo} stats={resume.stats} />
      </Box>

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 10, md: 14 }}>
          <ServicesSection skills={resume.skills} />

          <Box component="section" id="experience">
            <Experience experience={resume.experience} />
          </Box>

          <Box component="section" id="portfolio">
            <Portfolio portfolio={resume.portfolio} />
          </Box>

          <Projects projects={resume.projects} />
          <Education education={resume.education} />

          <Box component="section" id="skills">
            <Skills skills={resume.skills} />
          </Box>

          <Certifications certifications={resume.certifications} />

          <Box
            component="footer"
            id="contact"
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
}
