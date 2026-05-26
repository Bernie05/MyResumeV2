import React from "react";
import { Box, BoxProps, SxProps } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomBoxProps extends Omit<BoxProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseBox = React.forwardRef<HTMLDivElement, CustomBoxProps>(
  ({ sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          ...sx,
        }}
        {...props}
      />
    );
  },
);

export const CustomBox = withEditableField(BaseBox);
