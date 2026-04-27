import React from "react";

import { IconButton, Box } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { IEditorProps } from "../SecretResumeEditor";
import { getInlineFieldSxV2 } from "../utils/componentUtil";
import { ICON_MAP } from "@/components/resume/ServicesSection";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";

interface ICustomSocial {
  icon?: string;
  label: string;
  url: string;
}

interface ICustomStatsProps extends IEditorProps {
  socialLinks: ICustomSocial[];
}

export const CustomSocialMedia = ({
  socialLinks,
  isEditMode,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
}: ICustomStatsProps) => {
  const { isDarkMode } = useThemeContext();
  const { primaryAccent } = getSectionPalette(isDarkMode);

  return (
    <>
      {/* Custom Social Links */}
      {(socialLinks ?? []).map((s, idx) => (
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
              isEditMode,
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
          {s.icon && ICON_MAP[s.icon] ? (
            React.createElement(ICON_MAP[s.icon])
          ) : (
            <LinkIcon />
          )}
        </IconButton>
      ))}

      {/* Add Social Link */}
      {onAddAction && (
        <IconButton
          aria-label="Add social link"
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
          onClick={(event) =>
            onAddAction("social", event.currentTarget as HTMLElement)
          }
        >
          <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>+</Box>
        </IconButton>
      )}
    </>
  );
};
