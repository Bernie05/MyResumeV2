import React, { useCallback, useMemo } from "react";
import { getSectionPalette } from "@/theme/sectionPalette";
import { IconButton, Stack, SxProps, Theme } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { getInlineFieldSxV2 } from "../secret/utils/componentUtil";
import { ICON_MAP } from "../resume/ServicesSection";
import LinkIcon from "@mui/icons-material/Link";
import {
  useEditor,
  useIsEditMode,
  useActiveField,
  useOnFieldClick,
} from "@/hook/useEditor";

export interface SocialLink {
  icon?: React.ReactNode | string;
  href?: string;
  label: string;
  url?: string;
}

interface SocialMediaBtnProps {
  defaultLinks: SocialLink[];
  newLinks?: SocialLink[];
}

/**
 * Merges default and new social links, removing duplicates while preserving order
 * @param defaultLinks - Default links provided
 * @param newLinks - Newly added links
 * @returns Merged array of unique links with stable keys
 */
const mergeAndDeduplicateLinks = (
  defaultLinks: SocialLink[],
  newLinks: SocialLink[],
): (SocialLink & { key: string })[] => {
  const mergedLinks = [...defaultLinks, ...(newLinks || [])];

  const uniqueLinks = mergedLinks.reduce(
    (acc, link, index) => {
      // Use label + index as key to ensure uniqueness
      const key = `${link.label}-${index}`;
      // Check if this label already exists in accumulator
      if (!acc.some((l) => l.label === link.label)) {
        acc.push({ ...link, key });
      }
      return acc;
    },
    [] as (SocialLink & { key: string })[],
  );

  return uniqueLinks;
};

const SocialMediaButton = React.memo(
  ({
    icon,
    href,
    label,
    isDarkMode,
    primaryAccent,
    onInlineFieldClick,
    activeInlineFieldId,
  }: SocialLink & {
    isDarkMode: boolean;
    primaryAccent: string;
    onInlineFieldClick?: (
      section: string,
      fieldId: string,
      anchor: HTMLElement,
    ) => void;
    activeInlineFieldId?: string | null;
  }) => {
    const fieldId = `personalInfo.social.${label}`;
    const isActive = activeInlineFieldId === fieldId;

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
        href={onInlineFieldClick ? undefined : href}
        target={onInlineFieldClick ? undefined : "_blank"}
        rel={onInlineFieldClick ? undefined : "noopener noreferrer"}
        aria-label={label}
        onClick={onInlineFieldClick ? handleClick : undefined}
        sx={buttonSx}
      >
        {icon && ICON_MAP[icon as keyof typeof ICON_MAP]
          ? React.createElement(ICON_MAP[icon as keyof typeof ICON_MAP])
          : "+"}
      </IconButton>
    );
  },
);

SocialMediaButton.displayName = "SocialMediaButton";

export const SocialMediaBtn = ({
  defaultLinks = [],
  newLinks = [],
}: SocialMediaBtnProps) => {
  const { isDarkMode } = useThemeContext();
  const { primaryAccent } = getSectionPalette(isDarkMode);
  const editor = useEditor();
  const isEditMode = useIsEditMode();
  const activeFieldId = useActiveField();
  const onFieldClick = useOnFieldClick();

  const { onInlineFieldClick, activeInlineFieldId } = editor || {};

  // Merge default and new links, removing duplicates
  const mergedLinks = useMemo(
    () => mergeAndDeduplicateLinks(defaultLinks, newLinks),
    [defaultLinks, newLinks],
  );

  // Render all links (default + new + deduped)
  const renderedLinks = useMemo(
    () =>
      mergedLinks.map((link) => (
        <SocialMediaButton
          key={link.key}
          {...link}
          isDarkMode={isDarkMode}
          primaryAccent={primaryAccent}
          onInlineFieldClick={onFieldClick as any}
          activeInlineFieldId={activeFieldId ?? undefined}
        />
      )),
    [mergedLinks, isDarkMode, primaryAccent, onFieldClick, activeFieldId],
  );

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {renderedLinks}
    </Stack>
  );
};
