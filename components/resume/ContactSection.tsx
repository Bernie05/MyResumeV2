"use client";

import type { PersonalInfo } from "@/types/resume";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LanguageIcon from "@mui/icons-material/Language";
import React from "react";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useInquiryForm } from "@/hook/useInquiryForm";
import Box from "@mui/material/Box/Box";
import { getSectionPalette, IThemePalette } from "@/theme/sectionPalette";
import { useThemeContext } from "@/context/ThemeContext";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { useInlineEditing } from "@/hook/useInlineEditing";

interface ContactItem {
  icon: JSX.Element;
  label: string;
  value: string;
  href?: string;
  fieldId: InlineEditableFieldId;
}

interface SocialLinkItem {
  icon: JSX.Element;
  href: string;
  label: string;
  fieldId: InlineEditableFieldId;
}

interface ContactSectionProps {
  personalInfo: PersonalInfo;
  contactBadge?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: InlineEditableFieldId | null;
}

export const ContactSection = ({
  personalInfo,
  contactBadge,
  contactTitle,
  contactSubtitle,
  onInlineFieldClick,
  activeInlineFieldId,
}: ContactSectionProps) => {
  const { isDarkMode } = useThemeContext();
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
  } = getSectionPalette(isDarkMode);

  // Define social links based on the provided personalInfo. Each link includes an icon, href, label,
  // and a unique fieldId for inline editing. The links are filtered to remove any null values,
  // ensuring only valid social links are included in the final array.
  const socialLinks: SocialLinkItem[] = [
    personalInfo.linkedin
      ? {
          icon: <LinkedInIcon />,
          href: personalInfo.linkedin,
          label: "LinkedIn",
          fieldId: "personalInfo.linkedin" as InlineEditableFieldId,
        }
      : null,
    personalInfo.github
      ? {
          icon: <GitHubIcon />,
          href: personalInfo.github,
          label: "GitHub",
          fieldId: "personalInfo.github" as InlineEditableFieldId,
        }
      : null,
    personalInfo.website
      ? {
          icon: <LanguageIcon />,
          href: personalInfo.website,
          label: "Website",
          fieldId: "personalInfo.website" as InlineEditableFieldId,
        }
      : null,
  ].filter(Boolean) as SocialLinkItem[];

  // Define contact items based on the provided personalInfo. Each item includes an icon, label, value,
  // optional href for clickable links, and a unique fieldId for inline editing. These items are used
  // to display the user's contact information in the contact section of the resume.
  const contactItems: ContactItem[] = [
    {
      icon: <EmailOutlinedIcon fontSize="small" />,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      fieldId: "personalInfo.email" as InlineEditableFieldId,
    },
    {
      icon: <PhoneOutlinedIcon fontSize="small" />,
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
      fieldId: "personalInfo.phone" as InlineEditableFieldId,
    },
    {
      icon: <LocationOnOutlinedIcon fontSize="small" />,
      label: "Location",
      value: personalInfo.location,
      fieldId: "personalInfo.location" as InlineEditableFieldId,
    },
  ];

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "contact",
    activeInlineFieldId,
    onInlineFieldClick,
  });

  const { inquiryField, handleInquirySubmit, status, isSending } =
    useInquiryForm();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 3.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
      {/* Contact Badge */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
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
            mb: 1.5,
            ...getInlineFieldSx("contactBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("contactBadge")}
        >
          {contactBadge || "Contact Info"}
        </Box>

        {/* Contact Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
            color: titleColor,
            ...getInlineFieldSx("contactTitle"),
          }}
          {...createInlineFieldProps("contactTitle")}
        >
          {contactTitle || "Get In Touch"}
        </Typography>

        {/* Contact Subtitle */}
        <Typography
          sx={{
            mt: 1,
            maxWidth: 560,
            color: bodyColor,
            lineHeight: 1.6,
            fontSize: "1rem",
            ...getInlineFieldSx("contactSubtitle"),
          }}
          {...createInlineFieldProps("contactSubtitle")}
        >
          {contactSubtitle ||
            "Have a project in mind? Send a note and I'll reply by email."}
        </Typography>
      </Box>

      {/* Contact Items and Social Links */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
          },
          gap: { xs: 2, md: 3 },
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: { xs: 2, md: 2.5 },
            borderRadius: 4,
            background: surfaceBackground,
            border: `1px solid ${divider}`,
          }}
        >
          {/* Contact Items */}
          <Stack spacing={1}>
            {contactItems.map(({ icon, label, value, href, fieldId }) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1,
                  backgroundColor: softBackground,
                  ...getInlineFieldSx(fieldId),
                  borderRadius: 3,
                }}
                {...createInlineFieldProps(fieldId)}
              >
                {/* Contact Icon */}
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
                {/* Contact Value */}
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

          {/* Social Media Links for now it is no value */}
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
              {/* Social Media Icons */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {socialLinks.map(({ icon, href, label, fieldId }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    sx={{
                      width: 40,
                      height: 40,
                      color: isDarkMode ? "common.white" : titleColor,
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.78)"
                        : "rgba(255, 255, 255, 0.7)",
                      border: `1px solid ${divider}`,
                      backdropFilter: "blur(12px)",
                      ...getInlineFieldSx(fieldId),
                      transition:
                        "transform 0.25s ease, background-color 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        backgroundColor: `${primaryAccent}33`,
                      },
                    }}
                    onClick={(event) => {
                      if (onInlineFieldClick) {
                        event.preventDefault();
                        event.stopPropagation();
                        onInlineFieldClick(
                          "contact",
                          fieldId,
                          event.currentTarget as HTMLElement,
                        );
                      }
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

        {/* Contact Form */}
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 4,
            background: surfaceBackground,
            border: `1px solid ${divider}`,
          }}
        >
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleInquirySubmit}
          >
            {/* Honeypot: off-screen and skipped by keyboard/screen readers */}
            <Box
              component="input"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              {...inquiryField("website")}
              sx={{ position: "absolute", left: "-9999px", opacity: 0 }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Full name"
                required
                fullWidth
                variant="outlined"
                autoComplete="name"
                {...inquiryField("name")}
              />
              <TextField
                label="Email address"
                type="email"
                required
                fullWidth
                variant="outlined"
                autoComplete="email"
                {...inquiryField("email")}
              />
            </Stack>

            <TextField
              label="Message"
              required
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              placeholder="What are you working on, and how can I help?"
              {...inquiryField("message")}
            />

            {status.state === "sent" && (
              <Alert severity="success">
                Thanks! Your inquiry was sent. I&apos;ll get back to you by
                email soon.
              </Alert>
            )}
            {status.state === "error" && (
              <Alert severity="error">{status.message}</Alert>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSending}
                endIcon={
                  isSending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SendRoundedIcon />
                  )
                }
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
                {isSending ? "Sending…" : "Send message"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
