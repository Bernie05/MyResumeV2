"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
  Launch as LaunchIcon,
  GitHub as GitHubIcon,
  FormatQuote as FormatQuoteIcon,
} from "@mui/icons-material";
import { IPortfolioItem } from "@/types/portfolio";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import {
  useEditor,
  useActiveField,
  useIsEditMode,
  useOnFieldClick,
} from "@/hook/useEditor";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";

interface ProjectCardComponentProps extends IPortfolioItem {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
}

export const ProjectCardComponent = ({
  inlineSection = "projects",
  itemIndex = 0,
  ...item
}: ProjectCardComponentProps) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    titleColor,
    bodyColor,
    mutedColor,
    surfaceBackground,
    softBackground,
    outline,
    hoverShadow,
  } = getSectionPalette(isDarkMode);

  const isEditMode = useIsEditMode();
  const editor = useEditor();
  const activeInlineFieldId = useActiveField();
  const onInlineFieldClick = useOnFieldClick();
  const { onDeleteAction } = editor || {};

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: inlineSection,
    activeInlineFieldId,
    onInlineFieldClick,
  });

  const buildFieldId = (field: string): InlineEditableFieldId =>
    `${inlineSection}.${itemIndex}.${field}` as InlineEditableFieldId;

  const displayTitle = item.title ?? item.name ?? "";
  const demoUrl = item.demoUrl;
  const codeUrl = item.githubUrl ?? item.link;
  const technologies = item.technologies ?? [];

  return (
    <Card
      sx={{
        background: surfaceBackground,
        border: `1px solid ${outline}`,
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "all 0.3s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover": {
          boxShadow: hoverShadow,
          borderColor: primaryAccent,
        },
      }}
    >
      {onDeleteAction && (
        <IconButton
          aria-label="Delete item"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteAction(`${inlineSection}.${itemIndex}`);
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.55)",
            color: "common.white",
            width: 36,
            height: 36,
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
            transition: "transform 0.2s ease, opacity 0.2s ease",
            opacity: 0.9,
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "rgba(0,0,0,0.75)",
            },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}

      {item.image && (
        <Box
          sx={{
            ...getInlineFieldSx(buildFieldId("image")),
          }}
          {...createInlineFieldProps(buildFieldId("image"))}
        >
          <CardMedia
            component="img"
            image={item.image}
            alt={displayTitle}
            sx={{ height: 180, objectFit: "cover" }}
          />
        </Box>
      )}

      <CardContent
        sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {item.category && (
          <Chip
            label={item.category}
            size="small"
            sx={{
              alignSelf: "flex-start",
              mb: 1.5,
              backgroundColor: softBackground,
              color: primaryAccent,
              fontWeight: 600,
              fontSize: "0.7rem",
              ...getInlineFieldSx(buildFieldId("category")),
            }}
            {...createInlineFieldProps(buildFieldId("category"))}
          />
        )}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: titleColor,
            mb: 1,
            fontSize: "1.1rem",
            ...getInlineFieldSx(buildFieldId("name")),
          }}
          {...createInlineFieldProps(buildFieldId("name"))}
        >
          {displayTitle}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: mutedColor,
            mb: 2,
            flexGrow: 1,
            ...getInlineFieldSx(buildFieldId("description")),
          }}
          {...createInlineFieldProps(buildFieldId("description"))}
        >
          {item.description}
        </Typography>

        {technologies.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mb: 2,
              ...getInlineFieldSx(buildFieldId("technologies")),
            }}
            {...createInlineFieldProps(buildFieldId("technologies"))}
          >
            {technologies.map((tech, techIndex) => (
              <Chip
                key={`${tech}-${techIndex}`}
                label={tech}
                size="small"
                sx={{
                  backgroundColor: isDarkMode
                    ? `${primaryAccent}22`
                    : `${primaryAccent}15`,
                  color: primaryAccent,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
            ))}
          </Box>
        )}

        {item.client && item.testimonial && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              background: softBackground,
              ...getInlineFieldSx(buildFieldId("testimonial")),
            }}
            {...createInlineFieldProps(buildFieldId("testimonial"))}
          >
            <FormatQuoteIcon
              sx={{ fontSize: "1.1rem", color: primaryAccent, mb: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontStyle: "italic",
                color: bodyColor,
                mb: 0.5,
              }}
            >
              “{item.testimonial}”
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: mutedColor,
                ...getInlineFieldSx(buildFieldId("client")),
              }}
              {...createInlineFieldProps(buildFieldId("client"))}
            >
              — {item.client}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
          {demoUrl && (
            <Box
              component={isEditMode ? "span" : "a"}
              href={isEditMode ? undefined : demoUrl}
              target={isEditMode ? undefined : "_blank"}
              rel={isEditMode ? undefined : "noopener noreferrer"}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: primaryAccent,
                textDecoration: "none",
                ...getInlineFieldSx(buildFieldId("demoUrl")),
              }}
              {...createInlineFieldProps(buildFieldId("demoUrl"))}
            >
              <LaunchIcon sx={{ fontSize: "1rem" }} />
              Live Demo
            </Box>
          )}
          {codeUrl && (
            <Box
              component={isEditMode ? "span" : "a"}
              href={isEditMode ? undefined : codeUrl}
              target={isEditMode ? undefined : "_blank"}
              rel={isEditMode ? undefined : "noopener noreferrer"}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: mutedColor,
                textDecoration: "none",
                ...getInlineFieldSx(
                  buildFieldId(inlineSection === "portfolio" ? "githubUrl" : "link"),
                ),
              }}
              {...createInlineFieldProps(
                buildFieldId(inlineSection === "portfolio" ? "githubUrl" : "link"),
              )}
            >
              <GitHubIcon sx={{ fontSize: "1rem" }} />
              {inlineSection === "portfolio" ? "View Code" : "View Project"}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
