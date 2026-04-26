"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "./ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";

interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

interface EducationProps {
  education: EducationItem[];
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: InlineEditableFieldId | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (action: string) => void;
}

const Education = ({
  education,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  onDeleteAction,
}: EducationProps) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    titleColor,
    mutedColor,
    sectionBackground,
    surfaceBackground,
    softBackground,
    outline,
    divider,
    buttonGradient,
    accentText,
    hoverShadow,
  } = getSectionPalette(isDarkMode);

  const getInlineFieldSx = (fieldId: InlineEditableFieldId) => ({
    borderRadius: 1,
    outline:
      activeInlineFieldId === fieldId
        ? "2px solid rgba(20, 184, 166, 0.9)"
        : "2px solid transparent",
    outlineOffset: 2,
    cursor: onInlineFieldClick ? "pointer" : "inherit",
    transition: "outline-color 160ms ease, box-shadow 160ms ease",
    "&:hover": onInlineFieldClick
      ? {
          outlineColor: "rgba(20, 184, 166, 0.55)",
          boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
        }
      : undefined,
  });

  const createInlineFieldProps = (fieldId: InlineEditableFieldId) => {
    if (!onInlineFieldClick) {
      return {};
    }

    return {
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();
        onInlineFieldClick(
          "education",
          fieldId,
          event.currentTarget as HTMLElement,
        );
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick(
            "education",
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
      <Box sx={{ mb: 5 }}>
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
          Education
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
          }}
        >
          Education
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {education.map((edu, index) => (
          <Box key={edu.id}>
            <Card
              sx={{
                background: surfaceBackground,
                border: `1px solid ${outline}`,
                borderLeft: `4px solid ${primaryAccent}`,
                borderRadius: "1rem",
                transition: "all 0.3s ease",
                position: "relative",
                "&:hover": {
                  transform: "translateX(8px)",
                  boxShadow: hoverShadow,
                  borderLeftColor: primaryAccent,
                },
              }}
            >
              {onDeleteAction && (
                <IconButton
                  aria-label="Delete education"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteAction(`education.${index}`);
                  }}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: "common.white",
                    width: 38,
                    height: 38,
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
              <CardContent sx={{ p: 4 }}>
                {/* Header Row */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { sm: "space-between" },
                    alignItems: { sm: "flex-start" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        color: titleColor,
                        mb: 1,
                        ...getInlineFieldSx(`education.${index}.school`),
                      }}
                      {...createInlineFieldProps(`education.${index}.school`)}
                    >
                      {edu.school}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: primaryAccent,
                        ...getInlineFieldSx(`education.${index}.degree`),
                      }}
                      {...createInlineFieldProps(`education.${index}.degree`)}
                    >
                      {edu.degree} in {edu.field}
                    </Typography>
                  </Box>
                  <Chip
                    label={edu.year}
                    sx={{
                      backgroundColor: softBackground,
                      color: primaryAccent,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      ...getInlineFieldSx(`education.${index}.year`),
                    }}
                    {...createInlineFieldProps(`education.${index}.year`)}
                  />
                </Box>

                {/* Location */}
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: mutedColor,
                    ...getInlineFieldSx(`education.${index}.location`),
                  }}
                  {...createInlineFieldProps(`education.${index}.location`)}
                >
                  📍 {edu.location}
                </Typography>
              </CardContent>
            </Card>

            {index !== education.length - 1 && (
              <Box
                sx={{
                  my: 2,
                  borderTop: `1px solid ${divider}`,
                }}
              />
            )}
          </Box>
        ))}

        {/* Add Education Button */}
        {onAddAction && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              border: `2px dashed ${primaryAccent}50`,
              borderRadius: "1rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: primaryAccent,
                background: softBackground,
              },
            }}
            onClick={(event) =>
              onAddAction("education", event.currentTarget as HTMLElement)
            }
          >
            <Typography
              sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
            >
              + Add Education
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Education;
