"use client";

import { resumeData } from "@/data/resume";
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
import { Box, Container, Stack, Typography } from "@mui/material";

export default function Home() {
  const { isDarkMode } = useThemeContext();

  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      <Box component="section" id="about">
        <HeroSection
          personalInfo={resumeData.personalInfo}
          stats={resumeData.stats}
        />
      </Box>

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 10, md: 14 }}>
          <ServicesSection skills={resumeData.skills} />

          <Box component="section" id="experience">
            <Experience experience={resumeData.experience} />
          </Box>

          <Box component="section" id="portfolio">
            <Portfolio portfolio={resumeData.portfolio} />
          </Box>

          <Projects projects={resumeData.projects} />
          <Education education={resumeData.education} />

          <Box component="section" id="skills">
            <Skills skills={resumeData.skills} />
          </Box>

          <Certifications certifications={resumeData.certifications} />

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
              {new Date().getFullYear()} © {resumeData.personalInfo.name}. All
              rights reserved.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
