import React from "react";
import { SxProps, Typography, TypographyProps } from "@mui/material";
import { withEditableField } from "../hoc/withEditableField";

interface CustomTypographyProps extends Omit<TypographyProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

// when the user click the field it should be active, and the outline should be visible, otherwise the outline should be transparent.
const BaseTypography = React.forwardRef<HTMLDivElement, CustomTypographyProps>(
  ({ sx, ...props }, ref) => {
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
