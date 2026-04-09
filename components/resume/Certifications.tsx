"use client";

import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";

interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

const Certifications = ({
  certifications,
}: {
  certifications: Certification[];
}) => {
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
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            sx={{
              background: surfaceBackground,
              border: `1px solid ${outline}`,
              borderLeft: `4px solid ${primaryAccent}`,
              transition: "all 0.3s ease",
              "&:hover": {
                borderLeftColor: primaryAccent,
                boxShadow: hoverShadow,
              },
            }}
          >
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
                    }}
                  >
                    {cert.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: mutedColor,
                      mb: 1,
                    }}
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
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Certifications;
