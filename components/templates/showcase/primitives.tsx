"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box, IconButton, Typography, type SxProps, type Theme } from "@mui/material";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { useIsEditMode } from "@/hook/useEditor";
import { useEditableItem } from "@/hook/useInlineEditing";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import {
  EASE_OUT,
  HOVER_ONLY,
  RADIUS,
  REDUCED_MOTION,
  getShowcasePalette,
} from "./tokens";

export const useShowcasePalette = () =>
  getShowcasePalette(useThemeContext().isDarkMode);

// Merges the inline-edit outline sx from `field()` with a component's own sx.
export const withFieldSx = (
  own: SxProps<Theme>,
  fieldSx: SxProps<Theme>,
): SxProps<Theme> => [
  ...(Array.isArray(own) ? own : [own]),
  ...(Array.isArray(fieldSx) ? fieldSx : [fieldSx]),
];

/**
 * Fades content up once when it first scrolls into view. Seen once per visit,
 * so it can take its time (600ms). Skipped in edit mode so nothing moves under
 * the cursor while editing; reduced motion keeps the fade and drops the shift.
 */
export const Reveal = ({
  children,
  delay = 0,
  sx,
}: {
  children: ReactNode;
  delay?: number;
  sx?: SxProps<Theme>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isEditMode = useIsEditMode();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (isEditMode || !el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isEditMode]);

  const visible = shown || isEditMode;

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(28px)",
          transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 700ms ${EASE_OUT} ${delay}ms`,
          [REDUCED_MOTION]: {
            transform: "none",
            transition: `opacity 300ms ease ${delay}ms`,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
};

// Section headline: the editable `<section>Title` field, big and tight.
export const SectionHeading = ({
  section,
  fieldId,
  text,
  aside,
}: {
  section: ResumeEditableSection;
  fieldId: InlineEditableFieldId;
  text: string;
  aside?: ReactNode;
}) => {
  const { ink, rule } = useShowcasePalette();
  const { field } = useEditableItem(section);
  const heading = field(fieldId);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2,
        pb: { xs: 2.5, md: 3.5 },
        mb: { xs: 4, md: 6 },
        borderBottom: `1px solid ${rule}`,
      }}
    >
      <Typography
        component="h2"
        {...heading.props}
        sx={withFieldSx(
          {
            fontFamily: "inherit",
            fontWeight: 750,
            fontSize: "clamp(1.75rem, 3.4vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: ink,
            maxWidth: "18ch",
          },
          heading.sx,
        )}
      >
        {text}
      </Typography>
      {aside}
    </Box>
  );
};

// Dashed "+ Add …" row shown only in edit mode.
export const AddRow = ({
  label,
  onAdd,
  sx,
}: {
  label: string;
  onAdd?: (anchor: HTMLElement) => void;
  sx?: SxProps<Theme>;
}) => {
  const { accent } = useShowcasePalette();
  if (!onAdd) return null;

  return (
    <Box
      component="button"
      type="button"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onAdd(event.currentTarget);
      }}
      sx={[
        {
          display: "block",
          width: "100%",
          mt: 3,
          py: 2.25,
          px: 3,
          font: "inherit",
          fontWeight: 650,
          fontSize: "0.95rem",
          color: accent,
          background: "transparent",
          border: `1.5px dashed ${accent}`,
          borderRadius: RADIUS.frame,
          cursor: "pointer",
          opacity: 0.8,
          transition: `opacity 160ms ease, transform 160ms ${EASE_OUT}`,
          "&:hover": { opacity: 1 },
          "&:active": { transform: "scale(0.99)" },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      + {label}
    </Box>
  );
};

// Small round delete button pinned to an item's corner (edit mode only).
export const DeleteButton = ({
  label,
  onDelete,
  outside = false,
  top = 0,
}: {
  label: string;
  onDelete?: () => void;
  /** Sit on the item's corner instead of inside it (keeps it off screenshots). */
  outside?: boolean;
  /** Inside placement: offset from the item's top so the button centers on the title line. */
  top?: number | Record<string, number>;
}) => {
  const palette = useShowcasePalette();
  if (!onDelete) return null;

  return (
    <IconButton
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
      size="small"
      sx={{
        position: "absolute",
        top: outside ? { xs: -10, md: -18 } : top,
        right: outside ? { xs: -6, md: -18 } : 0,
        zIndex: 2,
        width: 32,
        height: 32,
        color: palette.paper,
        backgroundColor: palette.ink,
        border: `2px solid ${palette.paper}`,
        transition: `transform 160ms ${EASE_OUT}, background-color 160ms ease`,
        [HOVER_ONLY]: {
          "&:hover": { backgroundColor: palette.accent, color: palette.onAccent },
        },
        "&:active": { transform: "scale(0.94)" },
        "&:focus-visible": { outline: `2px solid ${palette.focus}`, outlineOffset: 2 },
      }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  );
};

// Shared pill-button look (primary = filled accent, secondary = outline).
export const pillSx = (
  variant: "primary" | "secondary",
  palette: ReturnType<typeof getShowcasePalette>,
): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 3,
  py: 1.5,
  borderRadius: RADIUS.pill,
  font: "inherit",
  fontWeight: 650,
  fontSize: "1rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
  textDecoration: "none",
  cursor: "pointer",
  border: `1.5px solid ${variant === "primary" ? palette.accent : palette.ink}`,
  color: variant === "primary" ? palette.onAccent : palette.ink,
  backgroundColor: variant === "primary" ? palette.accent : "transparent",
  transition: `transform 160ms ${EASE_OUT}, background-color 200ms ease, color 200ms ease`,
  [HOVER_ONLY]: {
    "&:hover":
      variant === "primary"
        ? { filter: "brightness(1.08)" }
        : { backgroundColor: palette.ink, color: palette.paper },
  },
  "&:active": { transform: "scale(0.97)" },
  "&:focus-visible": {
    outline: `2px solid ${palette.focus}`,
    outlineOffset: 3,
  },
});

// Small inline "+ …" button for adding a child entry (tag, bullet, skill) in edit mode.
export const AddInline = ({
  label,
  onAdd,
  pill = false,
}: {
  label: string;
  onAdd: (anchor: HTMLElement) => void;
  pill?: boolean;
}) => {
  const { accent } = useShowcasePalette();

  return (
    <Box
      component="button"
      type="button"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onAdd(event.currentTarget);
      }}
      sx={{
        font: "inherit",
        fontSize: "0.9rem",
        fontWeight: 600,
        lineHeight: 1.4,
        color: accent,
        background: "transparent",
        cursor: "pointer",
        border: pill ? `1px dashed ${accent}` : "none",
        borderRadius: pill ? RADIUS.pill : 0,
        px: pill ? 1.5 : 0,
        py: pill ? 0.5 : 0,
        transition: `transform 160ms ${EASE_OUT}`,
        "&:active": { transform: "scale(0.97)" },
      }}
    >
      + {label}
    </Box>
  );
};
