"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
  IconButton,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { TECH_ICON_MAP } from "@/components/resume/constants/techIcons";
import { ICON_MAP } from "@/components/resume/ServicesSection";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useIsEditMode } from "@/hook/useEditor";

interface SkillItem {
  readonly name: string;
  readonly proficiency: number;
  readonly icon?: string;
}

interface SkillCategory {
  readonly category: string;
  readonly items: readonly SkillItem[];
  readonly icon?: string;
  readonly subtitle?: string;
}

interface SkillsProps {
  readonly skills: readonly SkillCategory[];
  readonly skillsBadge?: string;
  readonly skillsTitle?: string;
  readonly skillsSubtitle?: string;
  readonly onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  readonly activeInlineFieldId?: InlineEditableFieldId | null;
  readonly onDeleteAction?: (action: string) => void;
  readonly onAddAction?: (action: string, anchor: HTMLElement) => void;
}

const ANIMATION_DURATION_MS = 1500;
const INTERSECTION_THRESHOLD = 0.2;
const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// 4-tier proficiency levels, derived from the raw 0-100 proficiency number
// at render time. This is a read-only display value — it is never stored
// in Redux/the data model (see types/resume.ts SkillItem).
const PROFICIENCY_LEVEL_THRESHOLDS = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
} as const;

// Gold/trophy chip styling shares this check with getProficiencyLabel below
// so a skill's "Expert" text label and its gold/trophy styling always agree.
const isExpertProficiency = (proficiency: number): boolean =>
  proficiency > PROFICIENCY_LEVEL_THRESHOLDS.advanced;

const createSkillKey = (category: string, skillName: string): string => {
  return `${category}-${skillName}`;
};

const getProficiencyLabel = (proficiency: number): string => {
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.beginner) return "Beginner";
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.intermediate)
    return "Intermediate";
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.advanced) return "Advanced";
  return "Expert";
};

// 1 = Beginner, 2 = Intermediate, 3 = Advanced, 4 = Expert — how many of the
// 4 tier dots should render filled. Mirrors getProficiencyLabel's thresholds.
const getProficiencyTierLevel = (proficiency: number): 1 | 2 | 3 | 4 => {
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.beginner) return 1;
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.intermediate) return 2;
  if (proficiency <= PROFICIENCY_LEVEL_THRESHOLDS.advanced) return 3;
  return 4;
};

const TIER_DOT_COUNT = 4;

// The color of the category icon and the progress bar/circle is determined by the category name. "Backend" uses the secondary accent color, while all other categories use the primary accent color.
const getCategoryColor = (
  category: string,
  primaryAccent: string,
  secondaryAccent: string,
): string => {
  return category === "Backend" ? secondaryAccent : primaryAccent;
};

// The icon for the category is determined by the category name. If a custom icon is provided and exists in the ICON_MAP, it will be used. Otherwise, default icons are used for "Frontend" and "Backend" categories, and a generic icon is used for all other categories.
const getCategoryIcon = (category: string, color: string, icon?: string) => {
  if (icon && ICON_MAP[icon]) {
    const Icon = ICON_MAP[icon];
    return <Icon sx={{ color }} />;
  }

  switch (category) {
    case "Frontend":
      return <BoltIcon sx={{ color }} />;
    case "Backend":
      return <TrendingUpIcon sx={{ color }} />;
    default:
      return <WorkspacePremiumIcon sx={{ color }} />;
  }
};

// Builds a record of animated values for each skill, based on the current progress of the animation. The keys are generated using the category and skill name, and the values are the proficiency percentages scaled by the progress (0 to 1).
const buildAnimatedValues = (
  skills: readonly SkillCategory[],
  progress: number,
): Record<string, number> => {
  return skills.reduce<Record<string, number>>((accumulator, category) => {
    category.items.forEach((item) => {
      accumulator[createSkillKey(category.category, item.name)] = Math.floor(
        item.proficiency * progress,
      );
    });

    return accumulator;
  }, {});
};

const Skills = ({
  skills,
  skillsBadge,
  skillsTitle,
  skillsSubtitle,
  onInlineFieldClick,
  activeInlineFieldId,
  onDeleteAction,
  onAddAction,
}: SkillsProps) => {
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
  const isEditMode = useIsEditMode();

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "skills",
    activeInlineFieldId,
    onInlineFieldClick,
  });

  useEffect(() => {
    const sectionElement = sectionRef.current;

    // Once the entrance animation has already played, don't replay it on
    // every data change (e.g. editing a skill's proficiency) — just snap
    // the displayed values straight to the current proficiency numbers so
    // the ring/bar/percentage stay in sync with the live `skills` prop.
    if (hasTriggeredRef.current) {
      setAnimatedValues(buildAnimatedValues(skills, 1));
      return;
    }

    if (!sectionElement) {
      return;
    }

    let frameId = 0;

    // Run the entrance animation, which animates the proficiency values from 0 to their actual values over a fixed duration. The animation is driven by requestAnimationFrame for smoothness.
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

    // Use IntersectionObserver to trigger the entrance animation when the skills section comes into view. This ensures that the animation only plays when the user scrolls to this part of the page, improving performance and user experience.
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
      {/* Section Badge */}
      <Box sx={{ mb: 8 }}>
        <Box
          sx={{
            display: "inline-flex",
            px: 1.75,
            py: 0.75,
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
            ...getInlineFieldSx("skillsBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("skillsBadge")}
        >
          {skillsBadge || "Skills"}
        </Box>

        {/* Section Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
            mb: 2,
            ...getInlineFieldSx("skillsTitle"),
          }}
          {...createInlineFieldProps("skillsTitle")}
        >
          {skillsTitle || "Professional Skills"}
        </Typography>

        {/* Section Subtitle */}
        <Typography
          variant="h6"
          sx={{
            color: mutedColor,
            fontWeight: 400,
            fontSize: "1.125rem",
            ...getInlineFieldSx("skillsSubtitle"),
          }}
          {...createInlineFieldProps("skillsSubtitle")}
        >
          {skillsSubtitle || "Expertise across technologies and platforms"}
        </Typography>
      </Box>

      {/* Skill Groups */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {skills.map((skillGroup, categoryIndex) => {
          const categoryColor = getCategoryColor(
            skillGroup.category,
            primaryAccent,
            secondaryAccent,
          );

          return (
            <Box key={categoryIndex}>
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
                {getCategoryIcon(
                  skillGroup.category,
                  categoryColor,
                  skillGroup.icon,
                )}
                {/* Category Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    fontWeight: 700,
                    color: categoryColor,
                    flexGrow: 1,
                    ...getInlineFieldSx(`skills.${categoryIndex}.category`),
                  }}
                  {...createInlineFieldProps(
                    `skills.${categoryIndex}.category`,
                  )}
                >
                  {skillGroup.category
                    ? `${skillGroup.category} Development`
                    : "+ Add category"}
                </Typography>

                {/* Delete Button */}
                {isEditMode && onDeleteAction && (
                  <IconButton
                    aria-label="Delete category"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteAction(`skills.${categoryIndex}`);
                    }}
                    sx={{
                      flexShrink: 0,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      color: "common.white",
                      width: 32,
                      height: 32,
                      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                      opacity: 0.9,
                      "&:hover": {
                        transform: "scale(1.05)",
                        backgroundColor: "rgba(0,0,0,0.75)",
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Skill Items */}
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
                {/* Skill Cards */}
                {skillGroup.items.map((skill, itemIndex) => {
                  const skillKey = createSkillKey(
                    skillGroup.category,
                    skill.name,
                  );
                  const animatedValue = animatedValues[skillKey] ?? 0;
                  const progressStroke =
                    (animatedValue / 100) * CIRCLE_CIRCUMFERENCE;

                  return (
                    <Card
                      key={itemIndex}
                      sx={{
                        background: surfaceBackground,
                        border: `1px solid ${outline}`,
                        borderRadius: "1rem",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        height: "100%",
                        position: "relative",
                        animation: "skillCardFadeIn 0.6s ease-out forwards",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: hoverShadow,
                          borderColor: categoryColor,
                        },
                      }}
                    >
                      {onDeleteAction && (
                        <IconButton
                          aria-label="Delete skill"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteAction(
                              `skills.${categoryIndex}.${itemIndex}`,
                            );
                          }}
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 2,
                            backgroundColor: "rgba(0,0,0,0.55)",
                            color: "common.white",
                            width: 32,
                            height: 32,
                            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
                            transition:
                              "transform 0.2s ease, opacity 0.2s ease",
                            opacity: 0.9,
                            "&:hover": {
                              transform: "scale(1.05)",
                              backgroundColor: "rgba(0,0,0,0.75)",
                            },
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      )}

                      {/* Skill Content */}
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
                              ...getInlineFieldSx(
                                `skills.${categoryIndex}.${itemIndex}.proficiency`,
                              ),
                            }}
                            {...createInlineFieldProps(
                              `skills.${categoryIndex}.${itemIndex}.proficiency`,
                            )}
                          >
                            <svg
                              width="100"
                              height="100"
                              viewBox="0 0 100 100"
                              style={{ transform: "rotate(-90deg)" }}
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r={CIRCLE_RADIUS}
                                stroke={softBackground}
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r={CIRCLE_RADIUS}
                                stroke={categoryColor}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                                strokeDashoffset={
                                  CIRCLE_CIRCUMFERENCE - progressStroke
                                }
                                style={{
                                  transition: "stroke-dashoffset 0.05s linear",
                                }}
                              />
                            </svg>
                            {/* Skill Value */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                variant="h4"
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

                          {/* Skill Name */}
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                                mb: 2,
                                ...getInlineFieldSx(
                                  `skills.${categoryIndex}.${itemIndex}.name`,
                                ),
                              }}
                              {...createInlineFieldProps(
                                `skills.${categoryIndex}.${itemIndex}.name`,
                              )}
                            >
                              {skill.icon && TECH_ICON_MAP[skill.icon] && (
                                <Box
                                  component={TECH_ICON_MAP[skill.icon]}
                                  sx={{
                                    fontSize: "1.1rem",
                                    color: categoryColor,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              {/* Skill Name */}
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 700,
                                  color: skill.name ? titleColor : mutedColor,
                                  fontSize: "1rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {skill.name || "+ Add skill"}
                              </Typography>
                            </Box>
                            {/* Skill Progress */}
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
                            {/* Proficiency Chip */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                icon={
                                  isExpertProficiency(skill.proficiency) ? (
                                    <EmojiEventsIcon sx={{ fontSize: 14 }} />
                                  ) : undefined
                                }
                                label={getProficiencyLabel(skill.proficiency)}
                                size="small"
                                sx={
                                  isExpertProficiency(skill.proficiency)
                                    ? {
                                        background: isDarkMode
                                          ? categoryColor
                                          : `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                                        color: accentText,
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                      }
                                    : {
                                        backgroundColor: isDarkMode
                                          ? `${categoryColor}33`
                                          : `${categoryColor}20`,
                                        color: categoryColor,
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                      }
                                }
                              />
                              {/* Proficiency Dots */}
                              <Box
                                role="img"
                                aria-label={`Proficiency tier: ${getProficiencyTierLevel(
                                  skill.proficiency,
                                )} of ${TIER_DOT_COUNT}`}
                                sx={{ display: "flex", gap: 0.25 }}
                              >
                                {Array.from({ length: TIER_DOT_COUNT }).map(
                                  (_, dotIndex) => {
                                    const isFilled =
                                      dotIndex <
                                      getProficiencyTierLevel(
                                        skill.proficiency,
                                      );

                                    return isFilled ? (
                                      <CircleIcon
                                        key={dotIndex}
                                        sx={{
                                          fontSize: 8,
                                          color: categoryColor,
                                        }}
                                      />
                                    ) : (
                                      <CircleOutlinedIcon
                                        key={dotIndex}
                                        sx={{
                                          fontSize: 8,
                                          color: isDarkMode
                                            ? `${categoryColor}55`
                                            : `${categoryColor}40`,
                                        }}
                                      />
                                    );
                                  },
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              {onAddAction && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    border: `2px dashed ${categoryColor}50`,
                    borderRadius: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: categoryColor,
                      background: softBackground,
                    },
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddAction(
                      `skills.${categoryIndex}.item`,
                      event.currentTarget as HTMLElement,
                    );
                  }}
                >
                  <Typography
                    sx={{
                      color: categoryColor,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    + Add Skill
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Skills;
