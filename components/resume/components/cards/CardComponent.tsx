import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../../../theme/sectionPalette";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { IPortfolioItem } from "@/types/portfolio";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";

interface CardComponentProps extends IPortfolioItem {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
  activeInlineFieldId?: string | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: string,
    anchor?: HTMLElement,
  ) => void;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
}

export const CardComponent = ({
  inlineSection,
  itemIndex,
  activeInlineFieldId,
  onInlineFieldClick,
  onAddAction,
  ...item
}: CardComponentProps) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    accentText,
    titleColor,
    bodyColor,
    mutedColor,
    surfaceBackground,
    softBackground,
    softerBackground,
    outline,
    buttonGradient,
    buttonHoverGradient,
    hoverShadow,
  } = getSectionPalette(isDarkMode);
  const [selectedId] = useState<number | null>(null);

  const buildFieldId = (fieldName: string) => {
    if (!inlineSection || itemIndex === undefined) {
      return null;
    }

    return `${inlineSection}.${itemIndex}.${fieldName}`;
  };

  const getInlineFieldSx = (fieldId: string | null) => ({
    borderRadius: 1,
    outline:
      fieldId && activeInlineFieldId === fieldId
        ? "2px solid rgba(20, 184, 166, 0.9)"
        : "2px solid transparent",
    outlineOffset: 2,
    cursor: fieldId && onInlineFieldClick ? "pointer" : "inherit",
    transition: "outline-color 160ms ease, box-shadow 160ms ease",
    "&:hover":
      fieldId && onInlineFieldClick
        ? {
            outlineColor: "rgba(20, 184, 166, 0.55)",
            boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
          }
        : undefined,
  });

  const createInlineFieldProps = (fieldId: string | null) => {
    if (!fieldId || !inlineSection || !onInlineFieldClick) {
      return {};
    }

    return {
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();
        onInlineFieldClick(
          inlineSection,
          fieldId,
          event.currentTarget as HTMLElement,
        );
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick(
            inlineSection,
            fieldId,
            event.currentTarget as HTMLElement,
          );
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": `Edit ${fieldId}`,
    };
  };

  const titleFieldId = buildFieldId("name");
  const descriptionFieldId = buildFieldId("description");
  const imageFieldId = buildFieldId("image");
  const techFieldId = buildFieldId("technologies");
  const testimonialFieldId = buildFieldId("testimonial");
  const clientFieldId = buildFieldId("client");

  return (
    <Card
      key={item.id}
      sx={{
        background: surfaceBackground,
        border: `1px solid ${outline}`,
        borderRadius: "1rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.5s ease",
        height: "100%",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: hoverShadow,
        },
      }}
    >
      <CardMedia
        component="img"
        height={selectedId === item.id ? "300" : "256"}
        image={item.image}
        alt={item.title || item.name || "Project image"}
        sx={{
          objectFit: "cover",
          borderRadius: 1,
          outline:
            imageFieldId && activeInlineFieldId === imageFieldId
              ? "2px solid rgba(20, 184, 166, 0.9)"
              : "2px solid transparent",
          outlineOffset: 2,
          cursor: imageFieldId && onInlineFieldClick ? "pointer" : "inherit",
          transition:
            "transform 0.5s ease, outline-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "scale(1.1)",
            ...(imageFieldId && onInlineFieldClick
              ? {
                  outlineColor: "rgba(20, 184, 166, 0.55)",
                  boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                }
              : undefined),
          },
        }}
        {...createInlineFieldProps(imageFieldId)}
      />

      <CardContent
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        {item.category && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={item.category}
              size="small"
              sx={{
                backgroundColor: softBackground,
                color: primaryAccent,
                fontWeight: 600,
              }}
            />
          </Box>
        )}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            mb: 2,
            color: titleColor,
            letterSpacing: "-0.02em",
            ...getInlineFieldSx(titleFieldId),
          }}
          {...createInlineFieldProps(titleFieldId)}
        >
          {item.title || item.name}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            mb: 4,
            lineHeight: 1.6,
            color: bodyColor,
            display: "-webkit-box",
            WebkitLineClamp: selectedId === item.id ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ...getInlineFieldSx(descriptionFieldId),
          }}
          {...createInlineFieldProps(descriptionFieldId)}
        >
          {item.longDescription || item.caseStudy || item.description}
        </Typography>

        {item.technologies && item.technologies.length > 0 && (
          <Box
            sx={{
              mb: 4,
              ...getInlineFieldSx(techFieldId),
            }}
            {...createInlineFieldProps(techFieldId)}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: mutedColor,
                display: "block",
                mb: 1.5,
              }}
            >
              Tech Stack
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {item.technologies.map((tech, idx) => (
                <Chip
                  key={idx}
                  label={tech}
                  size="small"
                  sx={{
                    backgroundColor: softBackground,
                    color: primaryAccent,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        {!item.technologies?.length &&
          onAddAction &&
          inlineSection &&
          itemIndex !== undefined && (
            <Box
              sx={{
                mb: 4,
                p: 1.5,
                border: `1px dashed ${primaryAccent}50`,
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: primaryAccent },
              }}
              onClick={(event) =>
                onAddAction(
                  `${inlineSection}.${itemIndex}.tech`,
                  event.currentTarget as HTMLElement,
                )
              }
            >
              <Typography
                sx={{
                  color: primaryAccent,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                + Add Tech Stack
              </Typography>
            </Box>
          )}

        {item.results && item.results.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: mutedColor,
                display: "block",
                mb: 1.5,
              }}
            >
              Key Results
            </Typography>
            <List sx={{ p: 0, m: 0 }}>
              {item.results.map((result, idx) => {
                const resultFieldId = buildFieldId(`result.${idx}`);
                return (
                  <ListItem
                    key={idx}
                    sx={{
                      p: 0,
                      mb: 1,
                      alignItems: "flex-start",
                      ...getInlineFieldSx(resultFieldId),
                    }}
                    {...createInlineFieldProps(resultFieldId)}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "24px", mt: 0.25, color: primaryAccent }}
                    >
                      <ChevronRightIcon sx={{ fontSize: "1.25rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={result}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "0.875rem",
                          color: bodyColor,
                        },
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
            {onAddAction && inlineSection && itemIndex !== undefined && (
              <Box
                sx={{
                  mt: 1,
                  display: "inline-flex",
                  cursor: "pointer",
                  color: primaryAccent,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                }}
                onClick={(event) =>
                  onAddAction(
                    `${inlineSection}.${itemIndex}.result`,
                    event.currentTarget as HTMLElement,
                  )
                }
              >
                + Add Key Result
              </Box>
            )}
          </Box>
        )}
        {!item.results?.length &&
          onAddAction &&
          inlineSection &&
          itemIndex !== undefined && (
            <Box
              sx={{
                mb: 4,
                p: 1.5,
                border: `1px dashed ${primaryAccent}50`,
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: primaryAccent },
              }}
              onClick={(event) =>
                onAddAction(
                  `${inlineSection}.${itemIndex}.result`,
                  event.currentTarget as HTMLElement,
                )
              }
            >
              <Typography
                sx={{
                  color: primaryAccent,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                + Add Key Results
              </Typography>
            </Box>
          )}

        {item.testimonial && (
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderLeft: `4px solid ${primaryAccent}`,
              backgroundColor: softerBackground,
              ...getInlineFieldSx(testimonialFieldId),
            }}
            {...createInlineFieldProps(testimonialFieldId)}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontStyle: "italic",
                mb: 1,
                color: bodyColor,
              }}
            >
              &ldquo;{item.testimonial}&rdquo;
            </Typography>
            {item.client && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: primaryAccent,
                  ...getInlineFieldSx(clientFieldId),
                }}
                {...createInlineFieldProps(clientFieldId)}
              >
                — {item.client}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, pt: 2, flexWrap: "wrap" }}>
          {item.demoUrl && (
            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              href={item.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: buttonGradient,
                color: accentText,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 3,
                py: 1.5,
                "&:hover": {
                  background: buttonHoverGradient,
                  boxShadow: hoverShadow,
                },
              }}
            >
              View Live
            </Button>
          )}
          {item.githubUrl && (
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: primaryAccent,
                color: primaryAccent,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: primaryAccent,
                  backgroundColor: softBackground,
                },
              }}
            >
              GitHub
            </Button>
          )}
          {item.link && (
            <Button
              variant="outlined"
              size="small"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: primaryAccent,
                color: primaryAccent,
                textTransform: "none",
                fontWeight: 600,
                flex: 1,
                minWidth: "100px",
                fontSize: "0.75rem",
                "&:hover": {
                  borderColor: primaryAccent,
                  backgroundColor: softBackground,
                },
              }}
            >
              Details
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
