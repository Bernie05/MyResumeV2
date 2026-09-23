import React, { useCallback, useMemo } from "react";
import { getSectionPalette } from "@/theme/sectionPalette";
import { Box, IconButton, SxProps, Theme } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { ICON_MAP } from "../resume/ServicesSection";
import LinkIcon from "@mui/icons-material/Link";
import { useEditor, useActiveField, useOnFieldClick } from "@/hook/useEditor";

export interface SocialLink {
  icon?: React.ReactNode | string;
  href?: string;
  label: string;
  url?: string;
}

interface SocialMediaBtnProps {
  links?: SocialLink[];
  /** Icons per row before wrapping; keeps rows readable instead of an unbounded row. */
  maxPerRow?: number;
}

// SocialMediaBtn is a React component that renders a grid of social media buttons based on the provided links. Each button can either be a clickable link or an editable field, depending on the presence of the onInlineFieldClick callback. The component uses the theme context to style the buttons according to the current theme (dark or light mode) and provides an option to add new social links if the onAddAction callback is available.
const SocialMediaButton = React.memo(
  ({
    icon,
    href,
    url,
    label,
    index,
    isDarkMode,
    primaryAccent,
    onInlineFieldClick,
    activeInlineFieldId,
  }: SocialLink & {
    index: number;
    isDarkMode: boolean;
    primaryAccent: string;
    onInlineFieldClick?: (
      section: string,
      fieldId: string,
      anchor: HTMLElement,
    ) => void;
    activeInlineFieldId?: string | null;
  }) => {
    const linkHref = href || url;
    // Keyed by index, not label, so each node keeps a stable identity (and
    // can be independently updated) even when the label is blank or shared.
    const fieldId = `personalInfo.social.${index}`;
    const isActive = activeInlineFieldId === fieldId;

    // Handle click event for the social media button. If the onInlineFieldClick callback is provided, it will be called with the section name, field ID, and the current target element. This allows for inline editing of the social media link when in edit mode.
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onInlineFieldClick) {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick("about", fieldId, event.currentTarget);
        }
      },
      [onInlineFieldClick, fieldId],
    );

    const buttonSx: SxProps<Theme> = useMemo(
      () => ({
        width: 52,
        height: 52,
        color: "common.white",
        backgroundColor: isDarkMode
          ? "rgba(15, 23, 42, 0.78)"
          : "rgba(255, 255, 255, 0.18)",
        border: "1px solid rgba(255,255,255,0.16)",
        backdropFilter: "blur(12px)",
        outline: isActive
          ? "2px solid rgba(20, 184, 166, 0.9)"
          : "2px solid transparent",
        outlineOffset: 2,
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
            : {}),
        },
      }),
      [isDarkMode, primaryAccent, onInlineFieldClick, isActive],
    );

    return (
      <IconButton
        component={onInlineFieldClick ? "button" : "a"}
        href={onInlineFieldClick ? undefined : linkHref}
        target={onInlineFieldClick ? undefined : "_blank"}
        rel={onInlineFieldClick ? undefined : "noopener noreferrer"}
        aria-label={label}
        onClick={onInlineFieldClick ? handleClick : undefined}
        sx={buttonSx}
      >
        {/* Icon */}
        {icon && ICON_MAP[icon as keyof typeof ICON_MAP] ? (
          React.createElement(ICON_MAP[icon as keyof typeof ICON_MAP])
        ) : (
          <LinkIcon fontSize="small" />
        )}
      </IconButton>
    );
  },
);

SocialMediaButton.displayName = "SocialMediaButton";

// SocialMediaBtn is a React component that renders a grid of social media buttons based on the provided links. Each button can either be a clickable link or an editable field, depending on the presence of the onInlineFieldClick callback. The component uses the theme context to style the buttons according to the current theme (dark or light mode) and provides an option to add new social links if the onAddAction callback is available.
export const SocialMediaBtn = ({
  links = [],
  maxPerRow = 6,
}: SocialMediaBtnProps) => {
  const { isDarkMode } = useThemeContext();
  const { primaryAccent } = getSectionPalette(isDarkMode);
  const editor = useEditor();
  const activeFieldId = useActiveField();
  const onFieldClick = useOnFieldClick();

  const { onAddAction } = editor || {};

  // Render every link keyed by its array index, so a node's identity (and
  // therefore its edit target) stays stable regardless of its label/icon.
  const renderedLinks = useMemo(
    () =>
      links.map((link, index) => (
        <SocialMediaButton
          key={index}
          {...link}
          index={index}
          isDarkMode={isDarkMode}
          primaryAccent={primaryAccent}
          onInlineFieldClick={onFieldClick as any}
          activeInlineFieldId={activeFieldId ?? undefined}
        />
      )),
    [links, isDarkMode, primaryAccent, onFieldClick, activeFieldId],
  );

  // Render the SocialMediaBtn component, which is a grid of social media buttons. Each button can be either a clickable link or an editable field, depending on the presence of the onInlineFieldClick callback. The component also provides an option to add new social links if the onAddAction callback is available. The appearance of the buttons is styled based on the current theme (dark or light mode).
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxPerRow}, 52px)`,
        gap: 1.5,
        justifyContent: "center",
      }}
    >
      {renderedLinks}

      {/* Add social link — always rendered after existing links so new
          entries never appear out of order. */}
      {onAddAction && (
        <IconButton
          aria-label="Add social link"
          onClick={(event) => {
            event.stopPropagation();
            onAddAction("social", event.currentTarget as HTMLElement);
          }}
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
        >
          <Box sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
            +
          </Box>
        </IconButton>
      )}
    </Box>
  );
};
