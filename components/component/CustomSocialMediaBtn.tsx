import React, { useCallback, useMemo } from "react";
import { IEditorProps } from "@/components/secret/SecretResumeEditor";
import { getSectionPalette } from "@/theme/sectionPalette";
import { IconButton, Stack, SxProps, Theme } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { getInlineFieldSxV2 } from "../secret/utils/componentUtil";
import { ICON_MAP } from "../resume/ServicesSection";
import LinkIcon from "@mui/icons-material/Link";

export interface SocialLink {
  icon: React.ReactNode | string;
  href?: string;
  label: string;
  url: string;
}

interface SocialMediaBtnProps extends IEditorProps {
  defaultLinks: SocialLink[];
  newLinks?: SocialLink[];
}

const combineLinks = (defaultLinks: SocialLink[], newLinks: SocialLink[]) => {
  const mergedLinks = [...defaultLinks, ...newLinks];

  const uniqueLinks = mergedLinks.reduce(
    (acc, link) => {
      // create a unique key using label and current length of acc
      const key = `${link.label}-${acc.length}`;
      if (!acc.some((l) => l.label === link.label)) {
        // add the unique key to the link object
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
        {"+"}
      </IconButton>
    );
  },
);

SocialMediaButton.displayName = "SocialMediaButton";

export const SocialMediaBtn = ({
  defaultLinks = [],
  newLinks = [],
  editorProps,
}: SocialMediaBtnProps) => {
  const { isDarkMode } = useThemeContext();
  const { primaryAccent } = getSectionPalette(isDarkMode);
  const { onInlineFieldClick, activeInlineFieldId } = editorProps || {};

  console.log("activeInlineFieldId: ", activeInlineFieldId);

  const a = combineLinks(defaultLinks, newLinks);

  console.log("combinedLinks: ", a);

  const memoizedDefaultLinks = useMemo(() => {
    return defaultLinks.map((s, idx) => (
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
            // isEditMode: false, // default links are not editable
          }),
          transition:
            "transform 0.25s ease, background-color 0.25s ease, outline-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "translateY(-3px)",
            backgroundColor: `${primaryAccent}`,
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
        {s.icon && ICON_MAP[s.icon as keyof typeof ICON_MAP] ? (
          React.createElement(ICON_MAP[s.icon as keyof typeof ICON_MAP])
        ) : (
          <LinkIcon />
        )}
      </IconButton>
    ));
  }, []);

  // TODO: Make sure that the idx is the key
  console.log("newLinks: ", newLinks);
  const memoizedLinks = useMemo(
    () =>
      newLinks.map((link) => (
        <SocialMediaButton
          key={link.label}
          {...link}
          isDarkMode={isDarkMode}
          primaryAccent={primaryAccent}
          onInlineFieldClick={onInlineFieldClick as any}
          activeInlineFieldId={activeInlineFieldId ?? undefined}
        />
      )),
    [
      newLinks,
      isDarkMode,
      primaryAccent,
      onInlineFieldClick,
      activeInlineFieldId,
    ],
  );

  // TODO: we need to create a function that merge the default and new added link after save.

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {/* Render Default Social Media Buttons */}
      {/* Render of the buttons */}
      {memoizedDefaultLinks}

      {/* New Social Media Buttons */}
      {/* Adding only of buttons */}
      {memoizedLinks}
    </Stack>
  );
};
