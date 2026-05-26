"use client";

import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useAnimatedStats } from "@/hook/useAnimated";
import { getSectionPalette, IThemePalette } from "../../theme/sectionPalette";
import DownloadIcon from "@mui/icons-material/Download";

import { type ResumeEditableSection } from "@/components/resume/ResumePage";
import { Box, Container, Stack, Typography } from "@mui/material";
import { heroSectionId, socialLinks, statItems } from "./constants/constant";
import {
  createInlineFieldProps,
  getCreatedInlineFields,
  getInlineFieldSxV2,
} from "../secret/utils/componentUtil";
import { SocialLink, SocialMediaBtn } from "../component/CustomSocialMediaBtn";
import {
  useEditor,
  useIsEditMode,
  useActiveField,
  useOnFieldClick,
} from "@/hook/useEditor";
import { CustomStats } from "../component/CustomStats";
import { CustomAvatar } from "../component/CustomAvatar";
import { CustomBox } from "../component/CustomBox";
import { CustomButton } from "../component/CustomButton";
import { CustomTypography } from "../component/CustomTypography";

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
  social?: SocialLink[];
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

export interface HeroSectionProps {
  personalInfo: PersonalInfo;
  stats?: HeroStats;
}

const HeroSection = ({ personalInfo, stats }: HeroSectionProps) => {
  const sectionId = "about";

  const isEditMode = useIsEditMode();
  const activeInlineFieldId = useActiveField();
  const onInlineFieldClick = useOnFieldClick();

  const { isDarkMode } = useThemeContext();
  const theme = getSectionPalette(isDarkMode);

  const { animatedStats, statsRef } = useAnimatedStats(stats, 2000);

  const { primaryAccent, accentGlow, accentText, buttonGradient } = theme;

  const inlineFieldClick = onInlineFieldClick as
    | ((
        section: ResumeEditableSection,
        fieldId: string,
        anchor?: HTMLElement,
      ) => void)
    | undefined;

  const personalInfoFields = getCreatedInlineFields(
    sectionId,
    "personalInfo",
    ["name", "title", "photoUrl", "backgroundUrl", "summary"],
    inlineFieldClick,
  );

  return (
    <Box
      id={`${heroSectionId}-main-container`}
      sx={{ position: "relative", width: "100%" }}
    >
      {/* Background Container */}
      <CustomBox
        id={`${heroSectionId}-background-container`}
        targetFieldId="personalInfo.backgroundUrl"
        targetSectionId={sectionId}
        {...personalInfoFields.backgroundUrl}
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
              <CustomAvatar
                id={`${heroSectionId}-avatar`}
                targetFieldId="personalInfo.photoUrl"
                targetSectionId="about"
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
                  outlineOffset: 2,
                }}
              />
            </Box>

            {/* Text Content */}
            <Stack
              id={`${heroSectionId}-text-content`}
              spacing={1.5}
              alignItems="center"
            >
              <CustomTypography
                targetSectionId={sectionId}
                targetFieldId="personalInfo.name"
                component="h1"
                color="common.white"
                fontWeight="800"
                letterSpacing="-0.04em"
                fontSize={{ xs: "2.75rem", sm: "4rem", md: "5.25rem" }}
                lineHeight="0.96"
              >
                {personalInfo.name}
              </CustomTypography>

              {/* Subtitle */}
              <CustomTypography
                targetSectionId="about"
                targetFieldId="personalInfo.title"
                color="common.white"
                fontWeight="700"
                letterSpacing="0.24em"
                textTransform="uppercase"
                fontSize={{ xs: "0.8rem", md: "0.95rem" }}
              >
                {personalInfo.title}
              </CustomTypography>

              {/* Summary */}
              {personalInfo.summary && (
                <CustomTypography
                  targetSectionId="about"
                  targetFieldId="personalInfo.summary"
                  color="common.white"
                  fontWeight="700"
                  letterSpacing="0.24em"
                  textTransform="uppercase"
                  fontSize={{ xs: "0.8rem", md: "0.95rem" }}
                >
                  {personalInfo.summary}
                </CustomTypography>
              )}
            </Stack>

            {/* Buttons Hire & Download */}
            <Stack
              id={`${heroSectionId}-action-buttons`}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              {/* Hire Button */}
              <CustomButton
                targetSectionId="about"
                targetFieldId="personalInfo.hireButtonText"
                variant="contained"
                component="a"
                href={
                  personalInfo.email
                    ? `mailto:${personalInfo.email}`
                    : "#contact"
                }
              >
                {personalInfo.hireButtonText || "Hire Me"}
              </CustomButton>

              {/* Download Button */}
              <CustomButton
                targetSectionId="about"
                targetFieldId="personalInfo.downloadButtonText"
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                {personalInfo.downloadButtonText || "Download CV"}
              </CustomButton>
            </Stack>

            {/* Social Media */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {/* Static Social Links */}
              {/* Make this component dynamic */}
              <SocialMediaBtn
                defaultLinks={socialLinks as SocialLink[]}
                newLinks={personalInfo.social ?? []}
              />
            </Stack>
          </Stack>
        </Container>
      </CustomBox>

      {/* Render of the Stats */}
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

                    {/* Stats Label */}
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

              {/* Render of the Custom Stats + */}
              <CustomStats stats={stats} />
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
