"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "./ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { AddButton } from "../component/static/AddButton";
import {
  useEditor,
  useActiveField,
  useOnFieldClick,
  useIsEditMode,
} from "@/hook/useEditor";

interface IEducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

interface IEducationProps {
  education: IEducationItem[];
  educationBadge?: string;
  educationTitle?: string;
}

const Education = ({
  education,
  educationBadge,
  educationTitle,
}: IEducationProps) => {
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

  const isEditMode = useIsEditMode();
  const editor = useEditor();
  const activeInlineFieldId = useActiveField();
  const onInlineFieldClick = useOnFieldClick();

  const { onAddAction, onDeleteAction } = editor || {};

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "education",
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
      <Box sx={{ mb: 5 }}>
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
            ...getInlineFieldSx("educationBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("educationBadge")}
        >
          {educationBadge || "Education"}
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
            ...getInlineFieldSx("educationTitle"),
          }}
          {...createInlineFieldProps("educationTitle")}
        >
          {educationTitle || "Education"}
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
                    {(edu.school || isEditMode) && (
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          color: edu.school ? titleColor : mutedColor,
                          mb: 1,
                          ...getInlineFieldSx(`education.${index}.school`),
                        }}
                        {...createInlineFieldProps(
                          `education.${index}.school`,
                        )}
                      >
                        {edu.school || "+ Add school"}
                      </Typography>
                    )}
                    {(edu.degree || isEditMode) && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.125rem",
                          color: primaryAccent,
                          ...getInlineFieldSx(`education.${index}.degree`),
                        }}
                        {...createInlineFieldProps(
                          `education.${index}.degree`,
                        )}
                      >
                        {edu.degree
                          ? `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`
                          : "+ Add degree"}
                      </Typography>
                    )}
                  </Box>
                  {(edu.year || isEditMode) && (
                    <Chip
                      label={edu.year || "+ Add year"}
                      sx={{
                        backgroundColor: softBackground,
                        color: primaryAccent,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        ...getInlineFieldSx(`education.${index}.year`),
                      }}
                      {...createInlineFieldProps(`education.${index}.year`)}
                    />
                  )}
                </Box>

                {/* Location */}
                {(edu.location || isEditMode) && (
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: mutedColor,
                      ...getInlineFieldSx(`education.${index}.location`),
                    }}
                    {...createInlineFieldProps(
                      `education.${index}.location`,
                    )}
                  >
                    📍 {edu.location || "+ Add location"}
                  </Typography>
                )}
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
          <AddButton targetSectionId="education">
            <Typography
              sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
            >
              + Add Education
            </Typography>
          </AddButton>
        )}
      </Box>
    </Box>
  );
};

export default Education;
