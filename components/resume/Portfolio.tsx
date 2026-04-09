"use client";

import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { IPortfolioItem } from "@/types/portfolio";
import { ProjectCardComponent } from "../cards/ProjectCardComponent";
import { getSectionPalette } from "../../theme/sectionPalette";

const Portfolio = ({ portfolio }: { portfolio: IPortfolioItem[] }) => {
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
          Portfolio
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
            color: titleColor,
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
            color: mutedColor,
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
};

export default Portfolio;
