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

interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

interface CertificationsProps {
  certifications: Certification[];
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: string,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: string | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (action: string) => void;
}

const Certifications = ({
  certifications,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  onDeleteAction,
}: CertificationsProps) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    titleColor,
    mutedColor,
    sectionBackground,
    surfaceBackground,
    softBackground,
    outline,
    buttonGradient,
    accentText,
    hoverShadow,
  } = getSectionPalette(isDarkMode);

  const getInlineFieldSx = (fieldId: string) => ({
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

  const createInlineFieldProps = (fieldId: string) => {
    if (!onInlineFieldClick) {
      return {};
    }

    return {
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();
        onInlineFieldClick(
          "certifications",
          fieldId,
          event.currentTarget as HTMLElement,
        );
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick(
            "certifications",
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
      <Box sx={{ mb: 4 }}>
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
          Certifications
        </Box>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: titleColor,
            fontSize: { xs: "1.875rem", md: "2.25rem" },
          }}
        >
          Certifications
        </Typography>
      </Box>

      {/* Certifications Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {certifications.map((cert, index) => (
          <Card
            key={cert.id}
            sx={{
              background: surfaceBackground,
              border: `1px solid ${outline}`,
              borderLeft: `4px solid ${primaryAccent}`,
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                borderLeftColor: primaryAccent,
                boxShadow: hoverShadow,
              },
            }}
          >
            {onDeleteAction && (
              <IconButton
                aria-label="Delete certification"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(`certifications.${index}`);
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Icon */}
                <SchoolIcon
                  sx={{
                    fontSize: "2.25rem",
                    color: primaryAccent,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: titleColor,
                      mb: 0.5,
                      ...getInlineFieldSx(`certifications.${index}.name`),
                    }}
                    {...createInlineFieldProps(`certifications.${index}.name`)}
                  >
                    {cert.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: mutedColor,
                      mb: 1,
                      ...getInlineFieldSx(`certifications.${index}.issuer`),
                    }}
                    {...createInlineFieldProps(
                      `certifications.${index}.issuer`,
                    )}
                  >
                    {cert.issuer}
                  </Typography>

                  {/* Year Chip */}
                  <Chip
                    label={cert.year}
                    size="small"
                    sx={{
                      background: softBackground,
                      color: primaryAccent,
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      ...getInlineFieldSx(`certifications.${index}.year`),
                    }}
                    {...createInlineFieldProps(`certifications.${index}.year`)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Certification Button */}
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
            onAddAction("certifications", event.currentTarget as HTMLElement)
          }
        >
          <Typography
            sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
          >
            + Add Certification
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Certifications;
