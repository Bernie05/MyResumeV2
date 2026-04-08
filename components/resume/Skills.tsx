"use client";

import { useEffect, useRef, useState } from "react";
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

interface SkillItem {
  readonly name: string;
  readonly proficiency: number;
}

interface SkillCategory {
  readonly category: string;
  readonly items: readonly SkillItem[];
}

interface SkillsProps {
  readonly skills: readonly SkillCategory[];
}

const ANIMATION_DURATION_MS = 1500;
const INTERSECTION_THRESHOLD = 0.2;
const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const EXPERT_THRESHOLD = 90;

function createSkillKey(category: string, skillName: string): string {
  return `${category}-${skillName}`;
}

function getProficiencyLabel(proficiency: number): string {
  if (proficiency >= EXPERT_THRESHOLD) return "Expert";
  if (proficiency >= 80) return "Advanced";
  if (proficiency >= 70) return "Proficient";
  return "Intermediate";
}

function getCategoryColor(
  category: string,
  primaryAccent: string,
  secondaryAccent: string,
): string {
  return category === "Backend" ? secondaryAccent : primaryAccent;
}

function getCategoryIcon(category: string, color: string) {
  switch (category) {
    case "Frontend":
      return <BoltIcon sx={{ color }} />;
    case "Backend":
      return <TrendingUpIcon sx={{ color }} />;
    default:
      return <WorkspacePremiumIcon sx={{ color }} />;
  }
}

function buildAnimatedValues(
  skills: readonly SkillCategory[],
  progress: number,
): Record<string, number> {
  return skills.reduce<Record<string, number>>((accumulator, category) => {
    category.items.forEach((item) => {
      accumulator[createSkillKey(category.category, item.name)] = Math.floor(
        item.proficiency * progress,
      );
    });

    return accumulator;
  }, {});
}

export default function Skills({ skills }: SkillsProps) {
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (hasTriggeredRef.current || !sectionElement) {
      return undefined;
    }

    let frameId = 0;

    const runAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);

        setAnimatedValues(buildAnimatedValues(skills, progress));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        hasTriggeredRef.current = true;
        runAnimation();
        observer.disconnect();
      },
      { threshold: INTERSECTION_THRESHOLD },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [skills]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        p: { xs: 3, md: 4.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
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
        {skills.map((skillGroup) => {
          const categoryColor = getCategoryColor(
            skillGroup.category,
            primaryAccent,
            secondaryAccent,
          );

          return (
            <Box key={skillGroup.category}>
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
                {getCategoryIcon(skillGroup.category, categoryColor)}
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    fontWeight: 700,
                    color: categoryColor,
                    flexGrow: 1,
                  }}
                >
                  {skillGroup.category} Development
                </Typography>
              </Box>

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
                {skillGroup.items.map((skill) => {
                  const skillKey = createSkillKey(
                    skillGroup.category,
                    skill.name,
                  );
                  const animatedValue = animatedValues[skillKey] ?? 0;
                  const progressStroke =
                    (animatedValue / 100) * CIRCLE_CIRCUMFERENCE;

                  return (
                    <Card
                      key={skillKey}
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
                          <Box
                            sx={{
                              display: "flex",
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
                              <Box
                                component="circle"
                                cx="50"
                                cy="50"
                                r={CIRCLE_RADIUS}
                                fill="none"
                                stroke={outline}
                                strokeWidth="4"
                              />
                              <Box
                                component="circle"
                                cx="50"
                                cy="50"
                                r={CIRCLE_RADIUS}
                                fill="none"
                                stroke={categoryColor}
                                strokeWidth="4"
                                strokeDasharray={`${progressStroke} ${CIRCLE_CIRCUMFERENCE}`}
                                strokeLinecap="round"
                                sx={{
                                  transition: "stroke-dasharray 0.8s ease-out",
                                }}
                              />
                            </Box>
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
                                {animatedValue}%
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ flex: 1 }}>
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

                            <Box sx={{ mb: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={animatedValue}
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
                              {skill.proficiency >= EXPERT_THRESHOLD && (
                                <Chip
                                  icon={
                                    <EmojiEventsIcon sx={{ fontSize: 14 }} />
                                  }
                                  label="Expert"
                                  size="small"
                                  sx={{
                                    background: isDarkMode
                                      ? categoryColor
                                      : `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                                    color: accentText,
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
