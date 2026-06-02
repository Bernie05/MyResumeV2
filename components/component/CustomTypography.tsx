import React from "react";
import { SxProps, Typography, TypographyProps } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";
import { useIsEditMode, useFieldEditorState } from "@/hook/useEditor";

interface CustomTypographyProps extends Omit<TypographyProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

// TODO: Active Click
// when the user click the field it should be active, and the outline should be visible, otherwise the outline should be transparent.
const BaseTypography = React.forwardRef<HTMLDivElement, CustomTypographyProps>(
  ({ sx, ...props }, ref) => {
    const theme = useThemeContext();

    return (
      <Typography
        ref={ref}
        sx={{
          ...sx,
        }}
        {...props}
      />
    );
  },
);

export const CustomTypography = withEditableField(BaseTypography);
