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
import { getSectionPalette } from "../../theme/sectionPalette";

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
                      {job.position}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: primaryAccent,
                      }}
                    >
                      {job.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={job.duration}
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
                    mb: 3,
                    color: mutedColor,
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
      </Box>
    </Box>
  );
}
