import React from "react";
import { Box, BoxProps } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomBoxProps extends BoxProps {
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseBox = React.forwardRef<HTMLDivElement, CustomBoxProps>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();
    const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);

    return (
      <Box
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

export const CustomBox = withEditableField(BaseBox);
