"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { useState, useEffect, useRef } from "react";

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    secondaryAccent,
    accentText,
    titleColor,
    mutedColor,
    sectionBackground,
    surfaceBackground,
    softBackground,
    outline,
    divider,
    buttonGradient,
    hoverShadow,
  } = getSectionPalette(isDarkMode);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>(
    {},
  );
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animate numbers when section comes into view (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          // Start animation when section becomes visible
          skills.forEach((category) => {
            category.items.forEach((item) => {
              const key = `${category.category}-${item.name}`;
              const startTime = Date.now();
              const duration = 1500; // 1.5 seconds animation

              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(progress * item.proficiency);

                setAnimatedValues((prev) => ({
                  ...prev,
                  [key]: currentValue,
                }));

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setAnimatedValues((prev) => ({
                    ...prev,
                    [key]: item.proficiency,
                  }));
                }
              };

              animate();
            });
          });
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [skills, hasTriggered]);

  const getAnimatedValue = (category: string, name: string): number => {
    return animatedValues[`${category}-${name}`] ?? 0;
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return "Expert";
    if (proficiency >= 80) return "Advanced";
    if (proficiency >= 70) return "Proficient";
    return "Intermediate";
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "#ef4444";
    if (proficiency >= 80) return "#f97316";
    if (proficiency >= 70) return "#eab308";
    return "#3b82f6";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <BoltIcon sx={{ color: primaryAccent }} />;
      case "Backend":
        return <TrendingUpIcon sx={{ color: secondaryAccent }} />;
      default:
        return <WorkspacePremiumIcon sx={{ color: primaryAccent }} />;
    }
  };

  const getCategoryAccentColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return primaryAccent;
      case "Backend":
        return secondaryAccent;
      default:
        return primaryAccent;
    }
  };

  const getCategoryLabelColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return primaryAccent;
      case "Backend":
        return secondaryAccent;
      default:
        return primaryAccent;
    }
  };

  return (
    <>
      <Box
        ref={sectionRef}
        sx={{
          p: { xs: 3, md: 4.5 },
          borderRadius: { xs: 4, md: 5 },
          background: sectionBackground,
          border: `1px solid ${outline}`,
        }}
      >
        {/* Section Header */}
        <Box sx={{ mb: 8 }}>
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
            Skills
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: titleColor,
              mb: 2,
            }}
          >
            Professional Skills
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: mutedColor,
              fontWeight: 400,
              fontSize: "1.125rem",
            }}
          >
            Expertise across technologies and platforms
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {skills.map((skillGroup, groupIndex) => {
            const categoryColor = getCategoryAccentColor(skillGroup.category);
            const categoryLabel = getCategoryLabelColor(skillGroup.category);

            return (
              <Box key={groupIndex}>
                {/* Category Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 5,
                    pb: 2,
                    borderBottom: `2px solid ${divider}`,
                  }}
                >
                  {getCategoryIcon(skillGroup.category)}
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.5rem", md: "1.875rem" },
                      fontWeight: 700,
                      color: categoryLabel,
                      flexGrow: 1,
                    }}
                  >
                    {skillGroup.category} Development
                  </Typography>
                </Box>

                {/* Skills Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {skillGroup.items.map((skill, skillIndex) => (
                    <Card
                      sx={{
                        background: surfaceBackground,
                        border: `1px solid ${outline}`,
                        borderRadius: "1rem",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        height: "100%",
                        animation: "skillCardFadeIn 0.6s ease-out forwards",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: hoverShadow,
                          borderColor: categoryColor,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, height: "100%" }}>
                        <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
                          {/* Circular Progress */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              position: "relative",
                              width: "100px",
                              height: "100px",
                            }}
                          >
                            <Box
                              component="svg"
                              viewBox="0 0 100 100"
                              sx={{
                                width: "100%",
                                height: "100%",
                                transform: "rotate(-90deg)",
                              }}
                            >
                              {/* Background Circle */}
                              <Box
                                component="circle"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={outline}
                                strokeWidth="4"
                              />
                              {/* Progress Circle */}
                              <Box
                                component="circle"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={categoryColor}
                                strokeWidth="4"
                                strokeDasharray={`${
                                  (getAnimatedValue(
                                    skillGroup.category,
                                    skill.name,
                                  ) /
                                    100) *
                                  282.7
                                } 282.7`}
                                strokeLinecap="round"
                                sx={{
                                  transition: "stroke-dasharray 0.8s ease-out",
                                }}
                              />
                            </Box>
                            {/* Center Percentage */}
                            <Box
                              sx={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "1.25rem",
                                  fontWeight: 900,
                                  color: categoryColor,
                                }}
                              >
                                {getAnimatedValue(
                                  skillGroup.category,
                                  skill.name,
                                )}
                                %
                              </Typography>
                            </Box>
                          </Box>

                          {/* Text Content */}
                          <Box sx={{ flex: 1 }}>
                            {/* Skill Name */}
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: titleColor,
                                fontSize: "1rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {skill.name}
                            </Typography>

                            {/* Progress Bar */}
                            <Box sx={{ mb: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={getAnimatedValue(
                                  skillGroup.category,
                                  skill.name,
                                )}
                                sx={{
                                  height: "6px",
                                  borderRadius: "3px",
                                  backgroundColor: softBackground,
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: "3px",
                                    backgroundColor: categoryColor,
                                    transition: "width 0.05s linear",
                                  },
                                }}
                              />
                            </Box>

                            {/* Proficiency Label & Badge */}
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mb: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label={getProficiencyLabel(skill.proficiency)}
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode
                                    ? `${categoryColor}33`
                                    : `${categoryColor}20`,
                                  color: categoryColor,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              />
                              {skill.proficiency >= 90 && (
                                <Chip
                                  icon={
                                    <EmojiEventsIcon sx={{ fontSize: 14 }} />
                                  }
                                  label="Expert"
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                                    color: accentText,
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              )}
                            </Box>

                            {/* Skill Level Dots */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {[...Array(5)].map((_, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      i <
                                      Math.ceil((skill.proficiency / 100) * 5)
                                        ? categoryColor
                                        : isDarkMode
                                          ? outline
                                          : softBackground,
                                    transition: "all 0.3s ease",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
