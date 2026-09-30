"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { NorthEast as NorthEastIcon } from "@mui/icons-material";
import type { ResumeData } from "@/types/resume";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import type { InquiryPayload } from "@/app/api/inquiry/route";
import { useEditableItem } from "@/hook/useInlineEditing";
import { useInquiryForm } from "@/hook/useInquiryForm";
import { EditableSection } from "../shared/EditableSection";
import { pillSx, useShowcasePalette, withFieldSx } from "./primitives";
import { EASE_OUT, HOVER_ONLY, RADIUS } from "./tokens";

const FORM_FIELDS: Array<{
  key: keyof InquiryPayload;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
}> = [
  { key: "name", label: "Your name", required: true, autoComplete: "name" },
  { key: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { key: "message", label: "What are you working on?", required: true, multiline: true },
];

export const ShowcaseContact = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode } = useEditableItem("contact");
  const { inquiryField, handleInquirySubmit, status, isSending } = useInquiryForm();
  const { personalInfo } = resume;

  const title = field("contactTitle");
  const subtitle = field("contactSubtitle");
  const email = field("personalInfo.email");

  const details: Array<{ fieldId: InlineEditableFieldId; value?: string; href?: string }> = [
    { fieldId: "personalInfo.phone", value: personalInfo.phone, href: personalInfo.phone && `tel:${personalInfo.phone}` },
    { fieldId: "personalInfo.location", value: personalInfo.location },
  ];
  const profiles: Array<{ fieldId: InlineEditableFieldId; label: string; href?: string }> = [
    { fieldId: "personalInfo.linkedin", label: "LinkedIn", href: personalInfo.linkedin },
    { fieldId: "personalInfo.github", label: "GitHub", href: personalInfo.github },
    { fieldId: "personalInfo.website", label: "Website", href: personalInfo.website },
  ];

  const inputSx = {
    width: "100%",
    font: "inherit",
    fontSize: "1rem",
    color: palette.ink,
    backgroundColor: palette.surface,
    border: `1px solid ${palette.rule}`,
    borderRadius: RADIUS.input,
    px: 2,
    py: 1.5,
    caretColor: palette.accent,
    transition: "border-color 160ms ease",
    "&:focus-visible": { outline: `2px solid ${palette.focus}`, outlineOffset: 1, borderColor: "transparent" },
    "&:disabled": { opacity: 0.6 },
  } as const;

  return (
    <EditableSection sectionId="contact" component="section">
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 4, lg: 6 },
          py: { xs: 6, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 6fr) minmax(0, 5fr)" },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box>
          <Typography
            component="h2"
            {...title.props}
            sx={withFieldSx(
              {
                fontFamily: "inherit",
                fontWeight: 800,
                fontStretch: "112%",
                fontSize: "clamp(1.75rem, 3.4vw, 3rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: palette.ink,
                mb: 1.5,
              },
              title.sx,
            )}
          >
            {resume.contactTitle || "Get in touch"}
          </Typography>
          <Typography
            {...subtitle.props}
            sx={withFieldSx(
              { fontFamily: "inherit", fontSize: "1rem", lineHeight: 1.6, color: palette.body, maxWidth: "46ch", mb: 3 },
              subtitle.sx,
            )}
          >
            {resume.contactSubtitle}
          </Typography>

          {(personalInfo.email || isEditMode) && (
            <Box
              component={isEditMode ? "span" : "a"}
              href={isEditMode ? undefined : `mailto:${personalInfo.email}`}
              {...email.props}
              sx={withFieldSx(
                {
                  display: "inline-block",
                  fontWeight: 700,
                  fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                  letterSpacing: "-0.02em",
                  color: palette.ink,
                  textDecoration: "underline",
                  textDecorationColor: palette.accent,
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "6px",
                  overflowWrap: "anywhere",
                  transition: `color 200ms ease`,
                  [HOVER_ONLY]: { "&:hover": { color: palette.accent } },
                  "&:focus-visible": { outline: `2px solid ${palette.focus}`, outlineOffset: 4, borderRadius: "4px" },
                },
                email.sx,
              )}
            >
              {personalInfo.email || "+ Add email"}
            </Box>
          )}

          <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
            {details
              .filter((detail) => detail.value || isEditMode)
              .map((detail) => {
                const detailField = field(detail.fieldId);
                return (
                  <Typography
                    key={detail.fieldId}
                    component={detail.href && !isEditMode ? "a" : "p"}
                    href={detail.href && !isEditMode ? detail.href : undefined}
                    {...detailField.props}
                    sx={withFieldSx(
                      { fontFamily: "inherit", color: palette.body, textDecoration: "none", width: "fit-content" },
                      detailField.sx,
                    )}
                  >
                    {detail.value || `+ Add ${detail.fieldId.split(".")[1]}`}
                  </Typography>
                );
              })}
          </Box>

          <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 3 }}>
            {profiles
              .filter((profile) => profile.href || isEditMode)
              .map((profile) => {
                const profileField = field(profile.fieldId);
                return (
                  <Box
                    key={profile.fieldId}
                    component={isEditMode ? "span" : "a"}
                    href={isEditMode ? undefined : profile.href}
                    target={isEditMode ? undefined : "_blank"}
                    rel={isEditMode ? undefined : "noopener noreferrer"}
                    {...profileField.props}
                    sx={withFieldSx(
                      {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontWeight: 650,
                        color: profile.href ? palette.ink : palette.muted,
                        fontStyle: profile.href ? "normal" : "italic",
                        textDecoration: "none",
                        "& svg": { transition: `transform 200ms ${EASE_OUT}` },
                        [HOVER_ONLY]: { "&:hover svg": { transform: "translate(2px, -2px)" } },
                      },
                      profileField.sx,
                    )}
                  >
                    {profile.href ? profile.label : `+ Add ${profile.label}`}
                    <NorthEastIcon sx={{ fontSize: "1rem" }} />
                  </Box>
                );
              })}
          </Box>
        </Box>

        <Box>
          <Box
            component="form"
            onSubmit={handleInquirySubmit}
            noValidate={false}
            onClick={(event: React.MouseEvent) => isEditMode && event.stopPropagation()}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box component="fieldset" disabled={isEditMode || isSending} sx={{ border: 0, p: 0, m: 0, display: "contents" }}>
              {FORM_FIELDS.map((formField) => {
                const binding = inquiryField(formField.key);
                const id = `showcase-inquiry-${formField.key}`;
                return (
                  <Box key={formField.key} sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Box component="label" htmlFor={id} sx={{ fontWeight: 600, fontSize: "0.95rem", color: palette.ink }}>
                      {formField.label}
                    </Box>
                    <Box
                      component={formField.multiline ? "textarea" : "input"}
                      id={id}
                      name={formField.key}
                      type={formField.multiline ? undefined : formField.type ?? "text"}
                      required={formField.required}
                      autoComplete={formField.autoComplete}
                      rows={formField.multiline ? 4 : undefined}
                      value={binding.value}
                      onChange={binding.onChange}
                      sx={{ ...inputSx, resize: formField.multiline ? "vertical" : undefined }}
                    />
                  </Box>
                );
              })}

              {/* Honeypot: hidden from people, only bots fill it in */}
              <Box
                component="input"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={inquiryField("website").value}
                onChange={inquiryField("website").onChange}
                sx={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
              />

              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 1 }}>
                <Box component="button" type="submit" sx={pillSx("primary", palette)}>
                  {isSending && <CircularProgress size={16} sx={{ color: palette.onAccent }} />}
                  {isSending ? "Sending" : "Send message"}
                </Box>
                {isEditMode && (
                  <Typography sx={{ color: palette.muted, fontSize: "0.9rem" }}>
                    The form is disabled while editing.
                  </Typography>
                )}
              </Box>
            </Box>

            <Box aria-live="polite">
              {status.state === "sent" && (
                <Typography role="status" sx={{ color: palette.ink, fontWeight: 600 }}>
                  Thanks, your message is on its way. I&apos;ll reply by email.
                </Typography>
              )}
              {status.state === "error" && (
                <Typography role="alert" sx={{ color: palette.accent, fontWeight: 600 }}>
                  {status.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 4, lg: 6 },
          color: palette.muted,
          fontSize: "0.9rem",
        }}
      >
        <Box sx={{ py: 4, borderTop: `1px solid ${palette.rule}` }}>
          {new Date().getFullYear()} © {personalInfo.name}
        </Box>
      </Box>
    </EditableSection>
  );
};
