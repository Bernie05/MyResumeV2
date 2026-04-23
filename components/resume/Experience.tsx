"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  FiberManualRecord,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";

interface Job {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
}

const Experience = ({
  experience,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  onDeleteAction,
}: {
  experience: Job[];
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: string | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (action: string) => void;
}) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    titleColor,
    bodyColor,
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

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "experience",
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
          Experience
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
          }}
        >
          Professional Experience
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {experience.map((job, index) => (
          <Box key={job.id}>
            <Card
              sx={{
                background: surfaceBackground,
                border: `1px solid ${outline}`,
                borderLeft: `4px solid ${primaryAccent}`,
                borderRadius: "1rem",
                transition: "all 0.3s ease",
                position: "relative",
                p: 2,
                "&:hover": {
                  transform: "translateX(8px)",
                  boxShadow: hoverShadow,
                  borderLeftColor: primaryAccent,
                },
              }}
            >
              {onDeleteAction && (
                <IconButton
                  aria-label="Delete experience"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteAction(`experience.${index}`);
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
                        ...getInlineFieldSx(`experience.${index}.position`),
                      }}
                      {...createInlineFieldProps(
                        `experience.${index}.position`,
                      )}
                    >
                      {job.position}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: primaryAccent,
                        ...getInlineFieldSx(`experience.${index}.company`),
                      }}
                      {...createInlineFieldProps(`experience.${index}.company`)}
                    >
                      {job.company}
                    </Typography>
                  </Box>

                  {/*  */}
                  <Chip
                    label={job.duration}
                    sx={{
                      backgroundColor: softBackground,
                      color: primaryAccent,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      ...getInlineFieldSx(`experience.${index}.duration`),
                    }}
                    {...createInlineFieldProps(`experience.${index}.duration`)}
                  />
                </Box>

                {/* Location */}
                <Typography
                  sx={{
                    fontSize: "1rem",
                    mb: 3,
                    color: mutedColor,
                    ...getInlineFieldSx(`experience.${index}.location`),
                  }}
                  {...createInlineFieldProps(`experience.${index}.location`)}
                >
                  📍 {job.location}
                </Typography>

                {/* Description List */}
                <List sx={{ p: 0, m: 0 }}>
                  {job.description.map((desc, bulletIndex) => (
                    <ListItem
                      key={bulletIndex}
                      sx={{
                        p: 0,
                        mb: 1.5,
                        alignItems: "flex-start",
                        ...getInlineFieldSx(
                          `experience.${index}.description.${bulletIndex}`,
                        ),
                      }}
                      {...createInlineFieldProps(
                        `experience.${index}.description.${bulletIndex}`,
                      )}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "24px",
                          mt: 0.5,
                          color: primaryAccent,
                        }}
                      >
                        <FiberManualRecord
                          sx={{ fontSize: "0.5rem", fill: "currentColor" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={desc}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "1rem",
                            color: bodyColor,
                            lineHeight: 1.6,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Add Bullet Button */}
                {onAddAction && (
                  <Box
                    sx={{
                      mt: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      color: primaryAccent,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      opacity: 0.7,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 1 },
                    }}
                    onClick={(event) =>
                      onAddAction(
                        `experience.${index}.bullet`,
                        event.currentTarget as HTMLElement,
                      )
                    }
                  >
                    + Add bullet point
                  </Box>
                )}
              </CardContent>
            </Card>

            {index !== experience.length - 1 && (
              <Box
                sx={{
                  my: 2,
                  borderTop: `1px solid ${divider}`,
                }}
              />
            )}
          </Box>
        ))}

        {/* Add Experience Button */}
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
              onAddAction("experience", event.currentTarget as HTMLElement)
            }
          >
            <Typography
              sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
            >
              + Add Experience
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Experience;
