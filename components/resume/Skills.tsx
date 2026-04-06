"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Zap, TrendingUp, Award, Trophy } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
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
        return <Zap size={24} style={{ color: "#3b82f6" }} />;
      case "Backend":
        return <TrendingUp size={24} style={{ color: "#a855f7" }} />;
      default:
        return <Award size={24} style={{ color: "#14b8a6" }} />;
    }
  };

  const getCategoryAccentColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "#3b82f6";
      case "Backend":
        return "#a855f7";
      default:
        return "#14b8a6";
    }
  };

  const getCategoryLabelColor = (category: string) => {
    if (isDarkMode) {
      switch (category) {
        case "Frontend":
          return "#60a5fa";
        case "Backend":
          return "#c084fc";
        default:
          return "#2dd4bf";
      }
    } else {
      switch (category) {
        case "Frontend":
          return "#2563eb";
        case "Backend":
          return "#9333ea";
        default:
          return "#0d9488";
      }
    }
  };

  return (
    <>
      <Box ref={sectionRef}>
        {/* Section Header */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: isDarkMode ? "#ffffff" : "#000000",
              mb: 2,
            }}
          >
            Professional Skills
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? "#a5a5a5" : "#666666",
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
                    borderBottom: `2px solid ${
                      isDarkMode ? "#444444" : "#e5e7eb"
                    }`,
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
                      className="skill-card-animate"
                      sx={{
                        background: isDarkMode
                          ? "linear-gradient(to bottom right, #1e293b, #0f172a)"
                          : "#ffffff",
                        border: `1px solid ${isDarkMode ? "#334155" : "#e5e7eb"}`,
                        borderRadius: "1rem",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        height: "100%",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: isDarkMode
                            ? "0 20px 25px rgba(148, 163, 184, 0.1)"
                            : "0 20px 25px rgba(0, 0, 0, 0.1)",
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
                            <svg
                              viewBox="0 0 100 100"
                              style={{
                                width: "100%",
                                height: "100%",
                                transform: "rotate(-90deg)",
                              }}
                            >
                              {/* Background Circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={isDarkMode ? "#334155" : "#d1d5db"}
                                strokeWidth="4"
                              />
                              {/* Progress Circle */}
                              <circle
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
                                style={{
                                  transition: "stroke-dasharray 0.8s ease-out",
                                }}
                              />
                            </svg>
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
                                color: isDarkMode ? "#ffffff" : "#000000",
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
                                  backgroundColor: isDarkMode
                                    ? "#334155"
                                    : "#e5e7eb",
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
                                  icon={<Trophy size={14} />}
                                  label="Expert"
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                                    color: "#ffffff",
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
                                          ? "#334155"
                                          : "#d1d5db",
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
        </Box>{" "}
      </Box>
      <style>{`
        @keyframes skillCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressStroke {
          from {
            stroke-dasharray: 0 282.7;
          }
        }

        .skill-card-animate {
          animation: skillCardFadeIn 0.6s ease-out forwards;
        }

        .progress-circle-animate {
          animation: progressStroke 1.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
