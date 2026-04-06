"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useThemeContext } from "@/context/ThemeContext";

interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

export default function Certifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  const { isDarkMode } = useThemeContext();
  const muiTheme = useTheme();

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: isDarkMode ? "#ffffff" : "#111827",
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
              background: isDarkMode
                ? "linear-gradient(to bottom right, #1e293b, #0f172a)"
                : "#ffffff",
              borderLeft: `4px solid ${isDarkMode ? "#10b981" : "#3b82f6"}`,
              transition: "all 0.3s ease",
              "&:hover": {
                borderLeftColor: isDarkMode ? "#34d399" : "#60a5fa",
                boxShadow: isDarkMode
                  ? "0 20px 25px -5px rgba(16, 185, 129, 0.2)"
                  : "0 20px 25px -5px rgba(59, 130, 246, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Icon */}
                <SchoolIcon
                  sx={{
                    fontSize: "2.25rem",
                    color: isDarkMode ? "#10b981" : "#3b82f6",
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: isDarkMode ? "#ffffff" : "#111827",
                      mb: 0.5,
                    }}
                  >
                    {cert.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? "#9ca3af" : "#4b5563",
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
                      background: isDarkMode
                        ? "rgba(16, 185, 129, 0.4)"
                        : "#3b82f6",
                      color: isDarkMode ? "#a7f3d0" : "#ffffff",
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
}
