import React from "react";
import { CardMedia, CardMediaProps, SxProps } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomCardMedia extends Omit<CardMediaProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseCardMedia = React.forwardRef<HTMLDivElement, CustomCardMedia>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();
    const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);

    return (
      <CardMedia
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

export const CustomCardMedia = withEditableField(BaseCardMedia);
