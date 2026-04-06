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
} from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";

interface Job {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
}

export default function Experience({ experience }: { experience: Job[] }) {
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
          Professional Experience
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {experience.map((job, index) => (
          <Box key={job.id}>
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
                      {job.position}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: "#3b82f6",
                      }}
                    >
                      {job.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={job.duration}
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
                    mb: 3,
                    color: isDarkMode ? "#9ca3af" : "#666666",
                  }}
                >
                  📍 {job.location}
                </Typography>

                {/* Description List */}
                <List sx={{ p: 0, m: 0 }}>
                  {job.description.map((desc, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        p: 0,
                        mb: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "24px",
                          mt: 0.5,
                          color: "#3b82f6",
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
                            color: isDarkMode ? "#d1d5db" : "#555555",
                            lineHeight: 1.6,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {index !== experience.length - 1 && (
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
