import React, { useCallback, useMemo } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { InlineEditableFieldId } from "../secret/constants/constant";
import { ResumeEditableSection } from "../resume/ResumePage";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomTypographyProps extends TypographyProps {
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseBox = React.forwardRef<HTMLDivElement, CustomTypographyProps>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();
    const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);

    return (
      <Typography
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
