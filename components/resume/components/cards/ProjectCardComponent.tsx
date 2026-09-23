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
  const { onDeleteAction, onAddAction } = editor || {};

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
      {/* Delete Button */}
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

      {/* Image */}
      {(item.image || isEditMode) && (
        <Box
          sx={{
            ...getInlineFieldSx(buildFieldId("image")),
          }}
          {...createInlineFieldProps(buildFieldId("image"))}
        >
          {item.image ? (
            <CardMedia
              component="img"
              image={item.image}
              alt={displayTitle}
              sx={{ height: 180, objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: softBackground,
                color: mutedColor,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              + Add image
            </Box>
          )}
        </Box>
      )}

      {/* Content */}
      <CardContent
        sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {(item.category || isEditMode) && (
          <Chip
            label={item.category || "+ Add tag"}
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

        {/* Title */}
        {(displayTitle || isEditMode) && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: displayTitle ? titleColor : mutedColor,
              mb: 1,
              fontSize: "1.1rem",
              ...getInlineFieldSx(buildFieldId("name")),
            }}
            {...createInlineFieldProps(buildFieldId("name"))}
          >
            {displayTitle || "+ Add title"}
          </Typography>
        )}

        {/* Description */}
        {(item.description || isEditMode) && (
          <Typography
            variant="body2"
            sx={{
              color: mutedColor,
              mb: 2,
              flexGrow: 1,
              fontStyle: item.description ? "normal" : "italic",
              ...getInlineFieldSx(buildFieldId("description")),
            }}
            {...createInlineFieldProps(buildFieldId("description"))}
          >
            {item.description || "+ Add description"}
          </Typography>
        )}

        {/* Technologies */}
        {(technologies.length > 0 || isEditMode) && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mb: 2,
              alignItems: "center",
            }}
          >
            {/* Technology Tags */}
            {technologies.map((tech, techIndex) => {
              const techFieldId =
                inlineSection === "portfolio" || inlineSection === "projects"
                  ? buildFieldId(`technologies.${techIndex}`)
                  : buildFieldId("technologies");
              return (
                <Chip
                  key={`${tech}-${techIndex}`}
                  label={tech || "+ Add tag"}
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode
                      ? `${primaryAccent}22`
                      : `${primaryAccent}15`,
                    color: primaryAccent,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    ...getInlineFieldSx(techFieldId),
                  }}
                  {...createInlineFieldProps(techFieldId)}
                />
              );
            })}

            {/* Add Tag Button */}
            {isEditMode &&
              onAddAction &&
              (inlineSection === "portfolio" ||
                inlineSection === "projects") && (
                <Chip
                  label="+ Add tag"
                  size="small"
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddAction(
                      `${inlineSection}.${itemIndex}.tech`,
                      event.currentTarget as HTMLElement,
                    );
                  }}
                  sx={{
                    borderStyle: "dashed",
                    borderColor: primaryAccent,
                    color: primaryAccent,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                />
              )}
          </Box>
        )}

        {/* Testimonial */}
        {((item.client && item.testimonial) || isEditMode) && (
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
              {item.testimonial ? `“${item.testimonial}”` : "+ Add testimonial"}
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
              — {item.client || "Client name"}
            </Typography>
          </Box>
        )}

        {/* Links */}
        <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
          {(demoUrl || isEditMode) && (
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
                color: demoUrl ? primaryAccent : mutedColor,
                fontStyle: demoUrl ? "normal" : "italic",
                textDecoration: "none",
                ...getInlineFieldSx(buildFieldId("demoUrl")),
              }}
              {...createInlineFieldProps(buildFieldId("demoUrl"))}
            >
              <LaunchIcon sx={{ fontSize: "1rem" }} />
              {demoUrl ? "Live Demo" : "+ Add live demo link"}
            </Box>
          )}

          {/* Code Link */}
          {(codeUrl || isEditMode) && (
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
                fontStyle: codeUrl ? "normal" : "italic",
                textDecoration: "none",
                ...getInlineFieldSx(
                  buildFieldId(
                    inlineSection === "portfolio" ? "githubUrl" : "link",
                  ),
                ),
              }}
              {...createInlineFieldProps(
                buildFieldId(
                  inlineSection === "portfolio" ? "githubUrl" : "link",
                ),
              )}
            >
              <GitHubIcon sx={{ fontSize: "1rem" }} />
              {codeUrl
                ? inlineSection === "portfolio"
                  ? "View Code"
                  : "View Project"
                : "+ Add code link"}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
