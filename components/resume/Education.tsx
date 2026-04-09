"use client";

import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";

interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

const Education = ({ education }: { education: EducationItem[] }) => {
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
                "&:hover": {
                  transform: "translateX(8px)",
                  boxShadow: hoverShadow,
                  borderLeftColor: primaryAccent,
                },
              }}
            >
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
                      }}
                    >
                      {edu.school}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: primaryAccent,
                      }}
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
                    }}
                  />
                </Box>

                {/* Location */}
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: mutedColor,
                  }}
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
      </Box>
    </Box>
  );
};

export default Education;
