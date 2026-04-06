"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useThemeContext } from "@/context/ThemeContext";
import { ProjectCardComponent } from "../cards/ProjectCardComponent";

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

export default function Projects({ projects }: { projects: Project[] }) {
  const { isDarkMode } = useThemeContext();

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: isDarkMode ? "#ffffff" : "#000000",
            mb: 2,
          }}
        >
          Recent Projects
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.125rem",
            color: isDarkMode ? "#a5a5a5" : "#666666",
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
        {projects.map((project) => (
          <ProjectCardComponent key={project.id} {...project} />
        ))}
      </Box>
    </Box>
  );
}
