import React from "react";

import { IEditorInterface } from "@/components/secret/SecretResumeEditor";
import { getInlineFieldSx } from "@/components/secret/utils/componentUtil";
import { IThemePalette } from "@/theme/sectionPalette";
import { Box, IconButton, Stack } from "@mui/material";
import { ICON_MAP } from "../resume/ServicesSection";
import LinkIcon from "@mui/icons-material/Link";

interface SocialMediaBtnProps extends IEditorInterface, IThemePalette {
  socialLinks: {
    icon: React.ReactNode;
    href: string;
    label: string;
  }[];
}

export const SocialMediaBtn = ({
  socialLinks,
  theme,
  isDarkMode,
  onInlineFieldClick,
  onAddAction,
}: SocialMediaBtnProps) => {
  const { primaryAccent } = theme;

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {socialLinks.map(({ icon, href, label }) => (
        <IconButton
          key={label}
          component="a"
          href={onInlineFieldClick ? undefined : href}
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
            ...getInlineFieldSx({
              fieldId: `personalInfo.social.${label}`,
              activeInlineFieldId: undefined,
              onInlineFieldClick,
            }),
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
                    `personalInfo.social.${label}`,
                    event.currentTarget as HTMLElement,
                  );
                },
              }
            : {})}
        >
          {icon}
        </IconButton>
      ))}
    </Stack>
  );
};
