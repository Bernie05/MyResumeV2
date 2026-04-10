"use client";

import type { PersonalInfo } from "@/types/resume";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LanguageIcon from "@mui/icons-material/Language";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box/Box";
import { IThemePalette } from "@/theme/sectionPalette";

interface ContactSectionProps extends IThemePalette {
  personalInfo: PersonalInfo;
}

export const ContactSection = ({
  theme,
  isDarkMode,
  personalInfo,
}: ContactSectionProps) => {
  const {
    sectionBackground,
    outline,
    buttonGradient,
    accentText,
    titleColor,
    divider,
    primaryAccent,
    bodyColor,
    mutedColor,
    surfaceBackground,
    softBackground,
  } = theme;

  // change this and use the herosection funvc
  const socialLinks = [
    personalInfo.linkedin
      ? {
          icon: <LinkedInIcon />,
          href: personalInfo.linkedin,
          label: "LinkedIn",
        }
      : null,
    personalInfo.github
      ? { icon: <GitHubIcon />, href: personalInfo.github, label: "GitHub" }
      : null,
    personalInfo.website
      ? { icon: <LanguageIcon />, href: personalInfo.website, label: "Website" }
      : null,
  ].filter(Boolean) as Array<{
    icon: JSX.Element;
    href: string;
    label: string;
  }>;

  const contactItems = [
    {
      icon: <EmailOutlinedIcon fontSize="small" />,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: <PhoneOutlinedIcon fontSize="small" />,
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
    },
    {
      icon: <LocationOnOutlinedIcon fontSize="small" />,
      label: "Location",
      value: personalInfo.location,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
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
          Contact Info
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
          }}
        >
          Get In Touch
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            maxWidth: 760,
            color: bodyColor,
            lineHeight: 1.8,
            fontSize: { xs: "1rem", md: "1.05rem" },
          }}
        >
          Reach out for collaboration, consulting, or product work. If you have
          a project in mind, send the details through the inquiry form and I can
          get back to you with the best next step.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
          },
          gap: { xs: 3, md: 4 },
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            background: surfaceBackground,
            border: `1px solid ${divider}`,
          }}
        >
          <Stack spacing={1.25}>
            <Typography
              variant="h5"
              sx={{ color: titleColor, fontWeight: 800 }}
            >
              Let&apos;s talk about your next build
            </Typography>
            <Typography sx={{ color: bodyColor, lineHeight: 1.8 }}>
              Share a project brief, product idea, or team requirement. I&apos;m
              open to engineering work, architecture support, and
              delivery-focused collaboration.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {contactItems.map(({ icon, label, value, href }) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: softBackground,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2.5,
                    color: accentText,
                    background: buttonGradient,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: mutedColor,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </Typography>
                  {href ? (
                    <Typography
                      component="a"
                      href={href}
                      sx={{
                        color: titleColor,
                        textDecoration: "none",
                        wordBreak: "break-word",
                        "&:hover": { color: primaryAccent },
                      }}
                    >
                      {value}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: titleColor }}>{value}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>

          {socialLinks.length > 0 ? (
            <Box sx={{ pt: 1, borderTop: `1px solid ${divider}` }}>
              <Typography
                sx={{
                  color: mutedColor,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  mb: 1.5,
                }}
              >
                Social Media
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {socialLinks.map(({ icon, href, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    sx={{
                      width: 52,
                      height: 52,
                      color: isDarkMode ? "common.white" : titleColor,
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.78)"
                        : "rgba(255, 255, 255, 0.7)",
                      border: `1px solid ${divider}`,
                      backdropFilter: "blur(12px)",
                      transition:
                        "transform 0.25s ease, background-color 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        backgroundColor: `${primaryAccent}33`,
                      },
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            background: surfaceBackground,
            border: `1px solid ${divider}`,
          }}
        >
          <Stack spacing={2.5}>
            <Box sx={{ pb: 2, borderBottom: `1px solid ${divider}` }}>
              <Typography
                variant="h5"
                sx={{ color: titleColor, fontWeight: 800, mb: 0.75 }}
              >
                Inquiry Form
              </Typography>
              <Typography sx={{ color: bodyColor }}>
                Send your details and a short message. This gives you a
                structured place to collect inquiries before wiring it to an API
                or email handler.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Full name" fullWidth variant="outlined" />
              <TextField
                label="Email address"
                type="email"
                fullWidth
                variant="outlined"
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Company or team" fullWidth variant="outlined" />
              <TextField label="Phone number" fullWidth variant="outlined" />
            </Stack>

            <TextField label="Inquiry subject" fullWidth variant="outlined" />

            <TextField
              label="Project details"
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              placeholder="Tell me about the work, goals, timeline, and what kind of help you need."
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                endIcon={<SendRoundedIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  color: accentText,
                  background: buttonGradient,
                  boxShadow: "none",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Send inquiry
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
