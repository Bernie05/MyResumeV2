"use client";

import { Fragment } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import {
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import type { ResumeData } from "@/types/resume";
import type { NavbarPosition } from "@/components/resume/ResumePage";
import { useThemeContext } from "@/context/ThemeContext";
import { useEditableItem } from "@/hook/useInlineEditing";
import { isAuthenticated } from "@/components/resume/util/authUtil";
import { secretEditor, statItems } from "@/components/resume/constants/constant";
import { downloadResumePdf } from "@/components/resume/pdf/downloadResumePdf";
import { EditableSection } from "../shared/EditableSection";
import { isSectionHidden } from "../shared/sectionVisibility";
import { useSectionOrder } from "../shared/sectionOrder";
import { pillSx, useShowcasePalette, withFieldSx } from "./primitives";
import { EASE_OUT, HOVER_ONLY, RADIUS, REDUCED_MOTION } from "./tokens";

const rise = keyframes`
  from { transform: translateY(105%); }
  to { transform: translateY(0); }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
`;
const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Page-load entrance, played once. Reduced motion keeps only the fade.
const enter = (delay: number, kind: "rise" | "fadeUp" = "fadeUp") => ({
  animation: `${kind === "rise" ? rise : fadeUp} 900ms ${EASE_OUT} ${delay}ms both`,
  [REDUCED_MOTION]: { animation: `${fade} 400ms ease ${delay}ms both` },
});

// Splits "Bernie A. Baltazar" into ["Bernie A.", "Baltazar"] for the wordmark.
const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return [name.trim()];
  const last = parts.pop() as string;
  return [parts.join(" "), last];
};

interface NavLink {
  label: string;
  href: string;
}

export const ShowcaseNav = ({
  resume,
  position,
}: {
  resume: ResumeData;
  position: NavbarPosition;
}) => {
  const palette = useShowcasePalette();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { data: session, status } = useSession();
  const hasAccess = isAuthenticated(status, session);

  const order = useSectionOrder();
  const rank = (id: string) => order.indexOf(id as (typeof order)[number]);

  // "Work" points at whichever of projects/portfolio comes first
  const workSection = (
    [
      resume.projects.length && "projects",
      resume.portfolio.length && "portfolio",
    ] as const
  )
    .filter((id) => id && !isSectionHidden(resume, id))
    .sort((a, b) => rank(a as string) - rank(b as string))[0];

  const links: NavLink[] = [
    workSection ? { label: "Work", href: `#${workSection}` } : null,
    resume.experience.length && !isSectionHidden(resume, "experience")
      ? { label: "Experience", href: "#experience" }
      : null,
    resume.skills.length && !isSectionHidden(resume, "skills")
      ? { label: "Skills", href: "#skills" }
      : null,
    isSectionHidden(resume, "contact") ? null : { label: "Contact", href: "#contact" },
  ]
    .filter(Boolean)
    .sort((a, b) => rank(a!.href.slice(1)) - rank(b!.href.slice(1))) as NavLink[];

  const firstName = resume.personalInfo.name.trim().split(/\s+/)[0] || "Home";

  const linkSx = {
    color: palette.ink,
    textDecoration: "none",
    fontWeight: 550,
    fontSize: "0.95rem",
    minHeight: 44,
    alignItems: "center",
    backgroundImage: `linear-gradient(${palette.accent}, ${palette.accent})`,
    backgroundSize: "0% 1.5px",
    backgroundPosition: "0 100%",
    backgroundRepeat: "no-repeat",
    transition: `background-size 260ms ${EASE_OUT}`,
    [HOVER_ONLY]: { "&:hover": { backgroundSize: "100% 1.5px" } },
    "&:focus-visible": {
      outline: `2px solid ${palette.focus}`,
      outlineOffset: 4,
      borderRadius: "4px",
    },
  } as const;

  return (
    <Box
      component="header"
      sx={{
        position,
        top: 0,
        zIndex: 20,
        backgroundColor: palette.paper,
        borderBottom: `1px solid ${palette.rule}`,
      }}
    >
      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 4, lg: 6 },
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 4 },
        }}
      >
        <Box
          component="a"
          href="#about"
          sx={{
            ...linkSx,
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: "-0.01em",
            display: "inline-flex",
            mr: "auto",
          }}
        >
          {firstName}
        </Box>

        {links.map((link) => (
          <Box
            key={link.href}
            component="a"
            href={link.href}
            sx={{
              ...linkSx,
              display: link.label === "Contact" ? "inline-flex" : { xs: "none", md: "inline-flex" },
            }}
          >
            {link.label}
          </Box>
        ))}

        {hasAccess && (
          <Box component="a" href={secretEditor} sx={{ ...linkSx, display: "inline-flex", color: palette.accent }}>
            Editor
          </Box>
        )}

        <IconButton
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          sx={{
            color: palette.ink,
            border: `1px solid ${palette.rule}`,
            width: 44,
            height: 44,
            transition: `transform 160ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.94)" },
          }}
        >
          {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  );
};

export const ShowcaseHero = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode } = useEditableItem("about");
  const { personalInfo, stats } = resume;

  const lines = splitName(personalInfo.name || "Your Name");
  // Wordmark fills its container: font size scales with the longest line so
  // any name fits edge to edge (0.74em ~ one expanded heavy capital).
  const longest = Math.max(...lines.map((line) => line.length), 4);

  const name = field("personalInfo.name");
  const title = field("personalInfo.title");
  const summary = field("personalInfo.summary");
  const photo = field("personalInfo.photoUrl");
  const hire = field("personalInfo.hireButtonText");
  const download = field("personalInfo.downloadButtonText");

  const hasPhoto = Boolean(personalInfo.photoUrl) || isEditMode;

  const visibleStats = statItems.filter(
    (item) => isEditMode || Number(stats[item.key as keyof typeof stats]) > 0,
  );

  return (
    <EditableSection sectionId="about" component="section">
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 4, lg: 6 },
          pt: { xs: 5, md: 7 },
          pb: { xs: 6, md: 8 },
          // Text left, portrait right (top-aligned with the wordmark); portrait leads on mobile
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: hasPhoto ? "minmax(0, 8fr) minmax(0, 4fr)" : "minmax(0, 1fr)" },
          gridTemplateRows: { md: "auto 1fr" },
          gridTemplateAreas: hasPhoto
            ? { xs: '"photo" "name" "info"', md: '"name photo" "info photo"' }
            : '"name" "info"',
          columnGap: { md: 8 },
          rowGap: { xs: 4, md: 3 },
        }}
      >
        {/* Wordmark */}
        <Box sx={{ containerType: "inline-size", gridArea: "name" }}>
          <Typography
            component="h1"
            aria-label={personalInfo.name}
            {...name.props}
            sx={withFieldSx(
              {
                fontFamily: "inherit",
                fontWeight: 800,
                fontStretch: "118%",
                textTransform: "uppercase",
                fontSize: `min(calc(100cqi / ${(longest * 0.74).toFixed(2)}), 9rem)`,
                lineHeight: 0.86,
                letterSpacing: "-0.02em",
                color: palette.ink,
                m: 0,
              },
              name.sx,
            )}
          >
            {lines.map((line, index) => (
              <Box
                key={index}
                component="span"
                aria-hidden
                sx={{ display: "block", overflow: "hidden", pb: "0.04em" }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: index === lines.length - 1 ? palette.accent : undefined,
                    ...enter(120 + index * 110, "rise"),
                  }}
                >
                  {line}
                </Box>
              </Box>
            ))}
          </Typography>
        </Box>

        {/* Portrait: reserved 4:5 frame (no layout shift), eager since it sits above the fold */}
        {hasPhoto && (
          <Box
            {...photo.props}
            sx={withFieldSx(
              {
                gridArea: "photo",
                alignSelf: "start",
                mt: { md: "0.4rem" }, // optical: top edge meets the wordmark's cap height
                justifySelf: { xs: "start", md: "end" },
                width: { xs: 104, md: "100%" },
                maxWidth: { md: 440 },
                aspectRatio: "4 / 5",
                borderRadius: RADIUS.frame,
                overflow: "hidden",
                backgroundColor: palette.surface,
                ...enter(200),
              },
              photo.sx,
            )}
          >
            {personalInfo.photoUrl && (
              <Box
                component="img"
                src={personalInfo.photoUrl}
                alt={`Portrait of ${personalInfo.name}`}
                loading="eager"
                decoding="async"
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </Box>
        )}

        {/* Title + summary + CTAs */}
        <Box
          sx={{
            gridArea: "info",
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4, md: 4 },
          }}
        >
          <Box sx={enter(380)}>
            <Typography
              {...title.props}
              sx={withFieldSx(
                {
                  fontFamily: "inherit",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(1.25rem, 2.2vw, 2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: palette.ink,
                  pb: "0.08em",
                },
                title.sx,
              )}
            >
              {personalInfo.title || "Your title"}
            </Typography>
          </Box>

          <Box sx={enter(480)}>
            <Typography
              {...summary.props}
              sx={withFieldSx(
                {
                  fontFamily: "inherit",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.55,
                  color: palette.body,
                  maxWidth: "52ch",
                  mb: visibleStats.length ? 1.5 : 3.5,
                },
                summary.sx,
              )}
            >
              {personalInfo.summary || "A short summary about you."}
            </Typography>

            {/* Stats read as one sentence ("7+ years experience, 50 completed projects…") */}
            {visibleStats.length > 0 && (
              <Typography sx={{ fontFamily: "inherit", color: palette.muted, fontSize: "1rem", lineHeight: 1.6, mb: 3.5, maxWidth: "52ch" }}>
                {visibleStats.map((item, index) => {
                  const statField = field(`stats.${item.key}` as `stats.${keyof ResumeData["stats"]}`);
                  const value = stats[item.key as keyof typeof stats];
                  return (
                    <Fragment key={item.key}>
                      <Box component="span" {...statField.props} sx={withFieldSx({ display: "inline", whiteSpace: "nowrap" }, statField.sx)}>
                        <Box component="strong" sx={{ color: palette.ink, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                          {typeof value === "number" ? value : 0}
                          {item.suffix ?? ""}
                        </Box>{" "}
                        {item.label.toLowerCase()}
                      </Box>
                      {index < visibleStats.length - 1 ? ", " : "."}
                    </Fragment>
                  );
                })}
              </Typography>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {isEditMode ? (
                <>
                  <Box
                    component="span"
                    {...hire.props}
                    sx={withFieldSx(pillSx("primary", palette), hire.sx)}
                  >
                    {personalInfo.hireButtonText || "Get in touch"}
                  </Box>
                  <Box
                    component="span"
                    {...download.props}
                    sx={withFieldSx(pillSx("secondary", palette), download.sx)}
                  >
                    {personalInfo.downloadButtonText || "Download CV"}
                  </Box>
                </>
              ) : (
                <>
                  <Box component="a" href="#contact" sx={pillSx("primary", palette)}>
                    {personalInfo.hireButtonText || "Get in touch"}
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => downloadResumePdf(resume)}
                    sx={pillSx("secondary", palette)}
                  >
                    {personalInfo.downloadButtonText || "Download CV"}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>

      </Box>
    </EditableSection>
  );
};
