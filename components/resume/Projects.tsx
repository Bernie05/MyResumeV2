"use client";

import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { ProjectCardComponent } from "./components/cards/ProjectCardComponent";
import { getSectionPalette } from "../../theme/sectionPalette";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { AddButton } from "../component/static/AddButton";

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
  demoUrl?: string;
  caseStudy?: string;
}

export interface IProjectsSection extends IEditorProps {
  projects: Project[];
}

const Projects = ({ projects, editorProps }: IProjectsSection) => {
  const { isDarkMode } = useThemeContext();
  const {
    titleColor,
    mutedColor,
    sectionBackground,
    outline,
    buttonGradient,
    accentText,
    primaryAccent,
  } = getSectionPalette(isDarkMode);

  const { onAddAction } = editorProps || {};

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
      {/* Section Header */}
      <Box sx={{ mb: 8 }}>
        <Box
          sx={{
            display: "inline-flex",
            px: 1.75,
            py: 0.75,
            borderRadius: 999,
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          Projects
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
            mb: 2,
          }}
        >
          Recent Projects
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.125rem",
            color: mutedColor,
            fontWeight: 400,
          }}
        >
          Latest work and technical achievements
        </Typography>
      </Box>

      {/* Projects Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {projects.map((project, index) => (
          <ProjectCardComponent
            key={project.id}
            {...project}
            inlineSection="projects"
            itemIndex={index}
            editorProps={editorProps}
          />
        ))}
      </Box>

      {/* Add Project Button */}
      {onAddAction && (
        <AddButton targetSectionId="projects" editorProps={editorProps}>
          <Typography
            sx={{
              color: primaryAccent,
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            + Add Project
          </Typography>
        </AddButton>
      )}
    </Box>
  );
};

export default Projects;
