import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // Add this missing import
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { IPortfolioItem } from "@/types/portfolio";

export const ProjectCardComponent = (item: IPortfolioItem) => {
  const { isDarkMode } = useThemeContext();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Card
      key={item.id}
      sx={{
        background: isDarkMode
          ? "linear-gradient(to bottom right, #1e293b, #0f172a)"
          : "#ffffff",
        borderRadius: "1rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.5s ease",
        height: "100%",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isDarkMode
            ? "0 20px 25px rgba(59, 130, 246, 0.2)"
            : "0 20px 25px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height={selectedId === item.id ? "300" : "256"}
        image={item.image}
        alt={item.title}
        sx={{
          objectFit: "cover",
          transition: "transform 0.5s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        {/* Category Badge */}
        {item.category && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={item.category}
              size="small"
              sx={{
                backgroundColor: isDarkMode
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
                fontWeight: 600,
              }}
            />
          </Box>
        )}

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            mb: 2,
            color: isDarkMode ? "#ffffff" : "#000000",
            letterSpacing: "-0.02em",
          }}
        >
          {item.title || item.name}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            mb: 4,
            lineHeight: 1.6,
            color: isDarkMode ? "#d1d5db" : "#555555",
            display: "-webkit-box",
            WebkitLineClamp: selectedId === item.id ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.longDescription || item.caseStudy || item.description}
        </Typography>

        {/* Technologies */}
        {item.technologies && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: isDarkMode ? "#9ca3af" : "#999999",
                display: "block",
                mb: 1.5,
              }}
            >
              Tech Stack
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {item.technologies.map((tech, idx) => (
                <Chip
                  key={idx}
                  label={tech}
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Results */}
        {item.results && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: isDarkMode ? "#9ca3af" : "#999999",
                display: "block",
                mb: 1.5,
              }}
            >
              Key Results
            </Typography>
            <List sx={{ p: 0, m: 0 }}>
              {item.results?.map((result, idx) => (
                <ListItem
                  key={idx}
                  sx={{ p: 0, mb: 1, alignItems: "flex-start" }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "24px", mt: 0.25, color: "#3b82f6" }}
                  >
                    <ChevronRightIcon sx={{ fontSize: "1.25rem" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={result}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.875rem",
                        color: isDarkMode ? "#d1d5db" : "#555555",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Testimonial */}
        {item.testimonial && (
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderLeft: "4px solid #3b82f6",
              backgroundColor: isDarkMode
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(59, 130, 246, 0.05)",
              borderRadius: "0.5rem",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontStyle: "italic",
                mb: 1,
                color: isDarkMode ? "#d1d5db" : "#555555",
              }}
            >
              "{item.testimonial}"
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#3b82f6",
              }}
            >
              — {item.client}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, pt: 2, flexWrap: "wrap" }}>
          {item.demoUrl && (
            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              href={item.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 3,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                  boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)",
                },
              }}
            >
              View Live
            </Button>
          )}
          {item.githubUrl && (
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: "#1d4ed8",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              GitHub
            </Button>
          )}

          {item.link && (
            <Button
              variant="outlined"
              size="small"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                textTransform: "none",
                fontWeight: 600,
                flex: 1,
                minWidth: "100px",
                fontSize: "0.75rem",
                "&:hover": {
                  borderColor: "#1d4ed8",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              Details
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
