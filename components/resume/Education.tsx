"use client";

import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useThemeContext } from "@/context/ThemeContext";

interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

export default function Education({
  education,
}: {
  education: EducationItem[];
}) {
  const { isDarkMode } = useThemeContext();

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: isDarkMode ? "#ffffff" : "#000000",
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
                background: isDarkMode
                  ? "linear-gradient(to bottom right, #1e293b, #0f172a)"
                  : "#ffffff",
                borderLeft: "4px solid #3b82f6",
                borderRadius: "1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(8px)",
                  boxShadow: isDarkMode
                    ? "0 20px 25px rgba(59, 130, 246, 0.15)"
                    : "0 20px 25px rgba(59, 130, 246, 0.15)",
                  borderLeftColor: "#60a5fa",
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
                        color: isDarkMode ? "#ffffff" : "#000000",
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
                        color: "#3b82f6",
                      }}
                    >
                      {edu.degree} in {edu.field}
                    </Typography>
                  </Box>
                  <Chip
                    label={edu.year}
                    sx={{
                      backgroundColor: isDarkMode
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  />
                </Box>

                {/* Location */}
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: isDarkMode ? "#9ca3af" : "#666666",
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
                  borderTop: `1px solid ${isDarkMode ? "#334155" : "#e5e7eb"}`,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
