"use client";

import { useThemeContext } from "@/context/ThemeContext";
import { useAnimatedStats } from "@/hook/useAnimated";
import { getSectionPalette } from "../../theme/sectionPalette";
import DownloadIcon from "@mui/icons-material/Download";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

interface PersonalInfo {
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
}

interface HeroStats {
  yearsExperience?: number;
  projects?: number;
  clients?: number;
  awards?: number;
}

export default function HeroSection({
  personalInfo,
  stats,
}: {
  personalInfo: PersonalInfo;
  stats?: HeroStats;
}) {
  const { isDarkMode } = useThemeContext();
  const { animatedStats, statsRef } = useAnimatedStats(stats, 2000);
  const {
    primaryAccent,
    secondaryAccent,
    accentGlow,
    accentText,
    buttonGradient,
    buttonHoverGradient,
  } = getSectionPalette(isDarkMode);

  const socialLinks = [
    { icon: <FacebookIcon />, href: "#", label: "Facebook" },
    { icon: <TwitterIcon />, href: "#", label: "Twitter" },
    {
      icon: <LinkedInIcon />,
      href: personalInfo.linkedin || "#",
      label: "LinkedIn",
    },
    { icon: <InstagramIcon />, href: "#", label: "Instagram" },
  ];

  const statItems: Array<{
    key: keyof HeroStats;
    label: string;
    suffix?: string;
  }> = [
    { key: "yearsExperience", label: "Years Experience", suffix: "+" },
    { key: "projects", label: "Completed Projects" },
    { key: "clients", label: "Happy Clients" },
    { key: "awards", label: "Honors and Awards", suffix: "+" },
  ];

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
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
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 10, md: 14 },
          }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Box
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
              <Avatar
                alt={personalInfo.name}
                src={personalInfo.photoUrl}
                sx={{
                  width: { xs: 160, md: 192 },
                  height: { xs: 160, md: 192 },
                  border: "4px solid",
                  borderColor: primaryAccent,
                  boxShadow: `0 24px 60px ${accentGlow}`,
                  transition: "transform 0.35s ease",
                  position: "relative",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>

            <Stack spacing={1.5} alignItems="center">
              <Typography
                component="h1"
                sx={{
                  color: "common.white",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  fontSize: { xs: "2.75rem", sm: "4rem", md: "5.25rem" },
                  lineHeight: 0.96,
                }}
              >
                {personalInfo.name}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.84)",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                }}
              >
                {personalInfo.title}
              </Typography>
              {personalInfo.summary && (
                <Typography
                  sx={{
                    maxWidth: 760,
                    color: "rgba(255,255,255,0.82)",
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.75,
                    mt: 1,
                  }}
                >
                  {personalInfo.summary}
                </Typography>
              )}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  color: accentText,
                  background: buttonGradient,
                  boxShadow: `0 18px 45px ${accentGlow}`,
                  "&:hover": {
                    background: buttonHoverGradient,
                  },
                }}
              >
                Hire Me
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "common.white",
                  borderColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    borderColor: "common.white",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Download CV
              </Button>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              {socialLinks.map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  aria-label={label}
                  sx={{
                    width: 52,
                    height: 52,
                    color: "common.white",
                    backgroundColor: isDarkMode
                      ? "rgba(15, 23, 42, 0.78)"
                      : "rgba(255, 255, 255, 0.18)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(12px)",
                    transition:
                      "transform 0.25s ease, background-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      backgroundColor: `${primaryAccent}55`,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

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
                      }}
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
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}
