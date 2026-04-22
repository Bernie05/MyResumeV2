"use client";

import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { ProjectCardComponent } from "./components/cards/ProjectCardComponent";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import { IEditorProps } from "../secret/SecretResumeEditor";

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

const Projects = ({
  projects,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  onDeleteAction,
  isEditMode,
}: IProjectsSection) => {
  const { isDarkMode } = useThemeContext();
  const {
    titleColor,
    mutedColor,
    sectionBackground,
    outline,
    buttonGradient,
    accentText,
  } = getSectionPalette(isDarkMode);

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
            activeInlineFieldId={activeInlineFieldId}
            onInlineFieldClick={onInlineFieldClick}
            onAddAction={onAddAction}
            onDelete={() => onDeleteAction?.(`projects.${index}`)}
            isEditMode={isEditMode}
          />
        ))}
      </Box>

      {/* Add Project Button */}
      {onAddAction && (
        <Box
          sx={{
            mt: 4,
            p: 4,
            border: `2px dashed ${accentText}40`,
            borderRadius: "1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: accentText,
              background: `${mutedColor}10`,
            },
          }}
          onClick={(event) =>
            onAddAction("projects", event.currentTarget as HTMLElement)
          }
        >
          <Typography
            sx={{
              color: accentText,
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            + Add Project
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Projects;
