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

// CustomCardMedia is a React component that wraps the MUI CardMedia component and enhances it with editable field functionality. It accepts standard CardMediaProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
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

BaseCardMedia.displayName = "BaseCardMedia";

// Wrap the BaseCardMedia component with the withEditableField HOC to create the CustomCardMedia component, which includes editable field functionality. This allows the card media to be interactive and editable within the context of a resume editor application.
export const CustomCardMedia = withEditableField(BaseCardMedia);
