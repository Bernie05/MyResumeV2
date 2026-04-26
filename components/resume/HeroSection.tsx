"use client";

import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useAnimatedStats } from "@/hook/useAnimated";
import { getSectionPalette, IThemePalette } from "../../theme/sectionPalette";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";
import { ICON_MAP } from "@/components/resume/ServicesSection";
import { type ResumeEditableSection } from "@/components/resume/ResumePage";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { heroSectionId, socialLinks, statItems } from "./constants/constant";
import {
  createInlineFieldProps,
  getCursorPointer,
  getInlineFieldSxV2,
} from "../secret/utils/componentUtil";
import { SocialMediaBtn } from "./components/buttons/SocialMediaBtn";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { InlineEditableFieldId } from "../secret/constants/constant";

export interface PersonalInfo {
  // Basic info
  name: string;
  title: string;
  photoUrl: string;
  backgroundUrl?: string;
  email?: string;
  location?: string;

  // Social media links
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;

  // Button text
  hireButtonText?: string;
  downloadButtonText?: string;

  // Custom social links
  social?: Array<{ label: string; url: string; icon?: string }>;
}

export interface HeroStats {
  yearsExperience?: number;
  projects?: number;
  clients?: number;
  awards?: number;
  custom?: Array<{ label: string; value: number; suffix?: string }>;
}

export interface StatsItems {
  key: keyof HeroStats;
  label: string;
  suffix?: string;
}

export interface HeroSectionProps extends IEditorProps {
  personalInfo: PersonalInfo;
  stats?: HeroStats;
}

const HeroSection = ({
  personalInfo,
  stats,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  isEditMode,
}: HeroSectionProps) => {
  const sectionId = "about";
  const { isDarkMode } = useThemeContext();
  const theme = getSectionPalette(isDarkMode);
  const cursor = getCursorPointer(isEditMode);

  const { animatedStats, statsRef } = useAnimatedStats(stats, 2000);

  const {
    primaryAccent,
    accentGlow,
    accentText,
    buttonGradient,
    buttonHoverGradient,
  } = theme;

  const inlineFieldClick = onInlineFieldClick as
    | ((
        section: ResumeEditableSection,
        fieldId: string,
        anchor?: HTMLElement,
      ) => void)
    | undefined;

  // Utility function to generate inline field props for all fields in a section, based on a common prefix and an array of field names. This helps reduce boilerplate when creating inline editable fields for sections with multiple fields (like personalInfo).
  const getAllInlineFields = <TField extends string>(
    prefixField: string,
    arr: readonly TField[],
  ): Record<TField, ReturnType<typeof createInlineFieldProps>> => {
    const inlineFields = {} as Record<
      TField,
      ReturnType<typeof createInlineFieldProps>
    >;

    for (const field of arr) {
      // This is a bit of a TypeScript hack to ensure the fieldId is correctly typed as InlineEditableFieldId
      inlineFields[field] = createInlineFieldProps(
        sectionId,
        `${prefixField}.${field}` as InlineEditableFieldId,
        onInlineFieldClick,
      );
    }

    return inlineFields;
  };

  const fields = getAllInlineFields("personalInfo", [
    "name",
    "title",
    "photoUrl",
    "backgroundUrl",
    "summary",
  ]);

  return (
    <Box
      id={`${heroSectionId}-main-container`}
      sx={{ position: "relative", width: "100%" }}
    >
      <Box
        id={`${heroSectionId}-background-img`}
        {...fields.backgroundUrl}
        sx={{
          position: "relative",
          minHeight: { xs: "100vh", md: 640 },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundImage: `url('${personalInfo.backgroundUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: isDarkMode
              ? "rgba(2, 6, 23, 0.78)"
              : "linear-gradient(90deg, rgba(15, 23, 42, 0.78) 0%, rgba(30, 41, 59, 0.48) 45%, rgba(30, 64, 175, 0.18) 100%)",
          },
          outline:
            activeInlineFieldId === "personalInfo.backgroundUrl"
              ? "2px solid rgba(20, 184, 166, 0.9)"
              : "2px solid transparent",
          cursor,
          "&:hover": {
            ...(onInlineFieldClick
              ? {
                  outlineColor: "rgba(20, 184, 166, 0.55)",
                  boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                }
              : undefined),
          },
        }}
      >
        {/* Content Container */}
        <Container
          id={`${heroSectionId}-content-container`}
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 10, md: 14 },
          }}
        >
          {/* Content Stack */}
          <Stack
            id={`${heroSectionId}-content-stack`}
            spacing={4}
            alignItems="center"
            textAlign="center"
          >
            <Box
              id={`${heroSectionId}-avatar-container`}
              sx={{ position: "relative", display: "inline-flex" }}
            >
              {/* Avatar Glow */}
              <Box
                id={`${heroSectionId}-avatar-glow`}
                sx={{
                  position: "absolute",
                  inset: -24,
                  borderRadius: "50%",
                  background: isDarkMode
                    ? "rgba(45, 212, 191, 0.22)"
                    : `radial-gradient(circle, ${primaryAccent}66 0%, transparent 70%)`,
                  filter: "blur(20px)",
                  opacity: 0.85,
                }}
              />

              {/* Avatar */}
              <Avatar
                id={`${heroSectionId}-avatar`}
                alt={personalInfo.name}
                src={personalInfo.photoUrl}
                sx={{
                  width: { xs: 160, md: 192 },
                  height: { xs: 160, md: 192 },
                  border: "4px solid",
                  borderColor: primaryAccent,
                  boxShadow: `0 24px 60px ${accentGlow}`,
                  position: "relative",
                  borderRadius: 1,
                  outline:
                    activeInlineFieldId === "personalInfo.photoUrl"
                      ? "2px solid rgba(20, 184, 166, 0.9)"
                      : "2px solid transparent",
                  outlineOffset: 2,
                  cursor,
                  transition:
                    "transform 0.35s ease, outline-color 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    ...(onInlineFieldClick
                      ? {
                          outlineColor: "rgba(20, 184, 166, 0.55)",
                          boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                        }
                      : undefined),
                  },
                }}
                {...fields.photoUrl}
              />
            </Box>

            {/* Text Content */}
            <Stack
              id={`${heroSectionId}-text-content`}
              spacing={1.5}
              alignItems="center"
            >
              <Typography
                component="h1"
                sx={{
                  color: "common.white",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  fontSize: { xs: "2.75rem", sm: "4rem", md: "5.25rem" },
                  lineHeight: 0.96,
                  ...getInlineFieldSxV2({
                    fieldId: "personalInfo.name",
                    activeInlineFieldId,
                    isEditMode,
                  }),
                }}
                {...fields.name}
              >
                {personalInfo.name}
              </Typography>

              {/* Subtitle */}
              <Typography
                id={`${heroSectionId}-subtitle`}
                sx={{
                  color: "rgba(255,255,255,0.84)",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                  ...getInlineFieldSxV2({
                    fieldId: "personalInfo.title",
                    activeInlineFieldId,
                    isEditMode,
                  }),
                }}
                {...fields.title}
              >
                {personalInfo.title}
              </Typography>

              {/* Summary */}
              {personalInfo.summary && (
                <Typography
                  id={`${heroSectionId}-summary`}
                  sx={{
                    maxWidth: 760,
                    color: "rgba(255,255,255,0.82)",
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.75,
                    mt: 1,
                    ...getInlineFieldSxV2({
                      fieldId: "personalInfo.summary",
                      activeInlineFieldId,
                      isEditMode,
                    }),
                  }}
                  {...fields.summary}
                >
                  {personalInfo.summary}
                </Typography>
              )}
            </Stack>

            {/* Buttons Hire & Download */}
            <Stack
              id={`${heroSectionId}-action-buttons`}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <Button
                variant="contained"
                component="a"
                href={
                  personalInfo.email
                    ? `mailto:${personalInfo.email}`
                    : "#contact"
                }
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  color: accentText,
                  background: buttonGradient,
                  boxShadow: `0 18px 45px ${accentGlow}`,
                  borderRadius: 999,
                  outline:
                    activeInlineFieldId === "personalInfo.hireButtonText"
                      ? "2px solid rgba(20, 184, 166, 0.9)"
                      : "2px solid transparent",
                  outlineOffset: 2,
                  cursor,
                  transition: "outline-color 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    background: buttonHoverGradient,
                    ...(onInlineFieldClick && {
                      outlineColor: "rgba(20, 184, 166, 0.55)",
                      boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                    }),
                  },
                }}
                {...(onInlineFieldClick && {
                  onClick: (event: React.MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onInlineFieldClick(
                      "about",
                      "personalInfo.hireButtonText",
                      event.currentTarget as HTMLElement,
                    );
                  },
                  role: "button",
                  tabIndex: 0,
                })}
              >
                {personalInfo.hireButtonText || "Hire Me"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "common.white",
                  borderColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 999,
                  outline:
                    activeInlineFieldId === "personalInfo.downloadButtonText"
                      ? "2px solid rgba(20, 184, 166, 0.9)"
                      : "2px solid transparent",
                  outlineOffset: 2,
                  cursor,
                  transition: "outline-color 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    borderColor: "common.white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    ...(onInlineFieldClick
                      ? {
                          outlineColor: "rgba(20, 184, 166, 0.55)",
                          boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                        }
                      : undefined),
                  },
                }}
                {...(onInlineFieldClick && {
                  onClick: (event: React.MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onInlineFieldClick(
                      "about",
                      "personalInfo.downloadButtonText",
                      event.currentTarget as HTMLElement,
                    );
                  },
                  role: "button",
                  tabIndex: 0,
                })}
              >
                {personalInfo.downloadButtonText || "Download CV"}
              </Button>
            </Stack>

            {/* Social Links */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <SocialMediaBtn
                socialLinks={socialLinks}
                theme={theme}
                isDarkMode={isDarkMode}
                onInlineFieldClick={inlineFieldClick}
                onAddAction={onAddAction}
              />

              {/* Custom Social Links */}
              {(personalInfo.social ?? []).map((s, idx) => (
                <IconButton
                  key={`custom-social-${idx}`}
                  component="a"
                  href={onInlineFieldClick ? undefined : s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label || "Custom link"}
                  sx={{
                    width: 52,
                    height: 52,
                    color: "common.white",
                    backgroundColor: isDarkMode
                      ? "rgba(15, 23, 42, 0.78)"
                      : "rgba(255, 255, 255, 0.18)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(12px)",
                    ...getInlineFieldSxV2({
                      fieldId: `personalInfo.social.custom.${idx}`,
                      activeInlineFieldId,
                      isEditMode,
                    }),
                    transition:
                      "transform 0.25s ease, background-color 0.25s ease, outline-color 160ms ease, box-shadow 160ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      backgroundColor: `${primaryAccent}55`,
                      ...(onInlineFieldClick
                        ? {
                            outlineColor: "rgba(20, 184, 166, 0.55)",
                            boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                          }
                        : undefined),
                    },
                  }}
                  {...(onInlineFieldClick
                    ? {
                        onClick: (event: React.MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onInlineFieldClick(
                            "about",
                            `personalInfo.social.custom.${idx}`,
                            event.currentTarget as HTMLElement,
                          );
                        },
                      }
                    : {})}
                >
                  {s.icon && ICON_MAP[s.icon] ? (
                    React.createElement(ICON_MAP[s.icon])
                  ) : (
                    <LinkIcon />
                  )}
                </IconButton>
              ))}
              {/* Add Social Link */}
              {onAddAction && (
                <IconButton
                  aria-label="Add social link"
                  sx={{
                    width: 52,
                    height: 52,
                    color: "common.white",
                    backgroundColor: "rgba(20, 184, 166, 0.25)",
                    border: "2px dashed rgba(20, 184, 166, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(20, 184, 166, 0.4)",
                    },
                  }}
                  onClick={(event) =>
                    onAddAction("social", event.currentTarget as HTMLElement)
                  }
                >
                  <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>+</Box>
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Stats transfer to other section */}
      {stats && (
        <Box
          ref={statsRef}
          sx={{
            backgroundColor: isDarkMode ? "#020617" : "#f8fafc",
            py: { xs: 8, md: 10 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
                gap: { xs: 4, md: 6 },
                maxWidth: 960,
                mx: "auto",
              }}
            >
              {statItems
                .filter(({ key }) => Boolean(stats[key] && stats[key] !== 0))
                .map(({ key, label, suffix }) => (
                  <Box
                    key={key}
                    sx={{
                      flex: "1 1 180px",
                      maxWidth: { xs: "100%", sm: 220 },
                      minWidth: { xs: 130, sm: 160 },
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        fontWeight: 800,
                        color: primaryAccent,
                        lineHeight: 1,
                        mb: 1,
                        ...getInlineFieldSxV2({
                          fieldId: `stats.${key}`,
                          activeInlineFieldId,
                          isEditMode,
                        }),
                      }}
                      {...createInlineFieldProps(
                        "stats",
                        `stats.${key}`,
                        inlineFieldClick,
                      )}
                    >
                      {(animatedStats[key] ?? 0).toLocaleString()}
                      {suffix}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        fontWeight: 600,
                        color: isDarkMode ? "#cbd5e1" : "#64748b",
                        maxWidth: 180,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              {(stats.custom ?? []).map((customStat, idx) => (
                <Box
                  key={`custom-stat-${idx}`}
                  sx={{
                    flex: "1 1 180px",
                    maxWidth: { xs: "100%", sm: 220 },
                    minWidth: { xs: 130, sm: 160 },
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      fontWeight: 800,
                      color: primaryAccent,
                      lineHeight: 1,
                      mb: 1,
                      ...getInlineFieldSxV2({
                        fieldId: `stats.custom.${idx}`,
                        activeInlineFieldId,
                        isEditMode,
                      }),
                    }}
                    {...createInlineFieldProps(
                      "stats",
                      `stats.custom.${idx}`,
                      inlineFieldClick,
                    )}
                  >
                    {customStat.value.toLocaleString()}
                    {customStat.suffix}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.85rem", md: "1rem" },
                      fontWeight: 600,
                      color: isDarkMode ? "#cbd5e1" : "#64748b",
                      maxWidth: 180,
                    }}
                  >
                    {customStat.label}
                  </Typography>
                </Box>
              ))}
              {onAddAction && (
                <Box
                  sx={{
                    flex: "1 1 180px",
                    maxWidth: { xs: "100%", sm: 220 },
                    minWidth: { xs: 130, sm: 160 },
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 1, sm: 2 },
                    cursor: "pointer",
                    border: `2px dashed ${primaryAccent}50`,
                    borderRadius: 2,
                    py: 2,
                    "&:hover": { borderColor: primaryAccent },
                  }}
                  onClick={(event) =>
                    onAddAction("stat", event.currentTarget as HTMLElement)
                  }
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: primaryAccent,
                      lineHeight: 1,
                      mb: 1,
                    }}
                  >
                    +
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: primaryAccent,
                    }}
                  >
                    Add Stat
                  </Typography>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
