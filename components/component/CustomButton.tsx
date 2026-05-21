import React from "react";
import { Button, ButtonProps } from "@mui/material";

import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";
import { useThemeContext } from "../../context/ThemeContext";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();
    const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);

    return (
      <Button
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

export const CustomButton = withEditableField(BaseButton);
