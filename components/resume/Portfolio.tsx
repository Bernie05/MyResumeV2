"use client";

import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { IPortfolioItem } from "@/types/portfolio";
import { ProjectCardComponent } from "./components/cards/ProjectCardComponent";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { useEditor, useActiveField, useOnFieldClick } from "@/hook/useEditor";
import { useInlineEditing } from "@/hook/useInlineEditing";

interface IPortfolioProps {
  portfolio: IPortfolioItem[];
  portfolioBadge?: string;
  portfolioTitle?: string;
  portfolioSubtitle?: string;
}

const Portfolio = ({
  portfolio,
  portfolioBadge,
  portfolioTitle,
  portfolioSubtitle,
}: IPortfolioProps) => {
  const editor = useEditor();
  const { onAddAction, onDeleteAction } = editor || {};
  const activeInlineFieldId = useActiveField();
  const onInlineFieldClick = useOnFieldClick();
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

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "portfolio",
    activeInlineFieldId,
    onInlineFieldClick,
  });

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
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
            ...getInlineFieldSx("portfolioBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("portfolioBadge")}
        >
          {portfolioBadge || "Portfolio"}
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
            color: titleColor,
            mb: 2,
            ...getInlineFieldSx("portfolioTitle"),
          }}
          {...createInlineFieldProps("portfolioTitle")}
        >
          {portfolioTitle || "Featured Work"}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: "42rem",
            fontSize: "1.125rem",
            color: mutedColor,
            fontWeight: 400,
            ...getInlineFieldSx("portfolioSubtitle"),
          }}
          {...createInlineFieldProps("portfolioSubtitle")}
        >
          {portfolioSubtitle ||
            "Explore my best projects and case studies. Each project showcases strategic problem-solving and technical excellence."}
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
        {portfolio.map((item, index) => (
          <ProjectCardComponent
            itemIndex={index}
            key={item.id}
            inlineSection="portfolio"
            {...item}
          />
        ))}
      </Box>

      {/* Add Portfolio Item Button */}
      {onAddAction && (
        <Box
          sx={{
            mt: 4,
            p: 4,
            border: `2px dashed ${primaryAccent}50`,
            borderRadius: "1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: primaryAccent,
              background: `${mutedColor}10`,
            },
          }}
          onClick={(event) => {
            event.stopPropagation();
            onAddAction("portfolio", event.currentTarget as HTMLElement);
          }}
        >
          <Typography
            sx={{
              color: primaryAccent,
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            + Add Portfolio Item
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Portfolio;
