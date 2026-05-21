import React, { useCallback, useMemo } from "react";
import { Avatar, AvatarProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomAvatarProps extends AvatarProps {
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseAvatar = React.forwardRef<HTMLDivElement, CustomAvatarProps>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();
    const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);

    return (
      <Avatar
        ref={ref}
        sx={{
          ...sx,
          "&:hover": {
            background: buttonHoverGradient,
          },
        }}
        {...props}
      />
    );
  },
);

export const CustomAvatar = withEditableField(BaseAvatar);
