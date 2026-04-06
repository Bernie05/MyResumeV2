"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { IPortfolioItem } from "@/types/portfolio";
import { ProjectCardComponent } from "../cards/ProjectCardComponent";

export default function Portfolio({
  portfolio,
}: {
  portfolio: IPortfolioItem[];
}) {
  const { isDarkMode } = useThemeContext();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
            color: isDarkMode ? "#ffffff" : "#000000",
            mb: 2,
          }}
        >
          Featured Work
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: "42rem",
            fontSize: "1.125rem",
            color: isDarkMode ? "#a5a5a5" : "#666666",
            fontWeight: 400,
          }}
        >
          Explore my best projects and case studies. Each project showcases
          strategic problem-solving and technical excellence.
        </Typography>
      </Box>

      {/* Portfolio Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
          gap: 4,
        }}
      >
        {portfolio.map((item) => (
          <ProjectCardComponent key={item.id} {...item} />
        ))}
      </Box>
    </Box>
  );
}
