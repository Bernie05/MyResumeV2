import React from "react";
import { SxProps, Typography, TypographyProps } from "@mui/material";
import { withEditableField } from "../hoc/withEditableField";

interface CustomTypographyProps extends Omit<TypographyProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

// CustomTypography is a React component that wraps the MUI Typography component and enhances it with editable field functionality. It accepts standard TypographyProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
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

BaseTypography.displayName = "BaseTypography";

// Wrap the BaseTypography component with the withEditableField HOC to create the CustomTypography component, which includes editable field functionality.
// This allows the typography to be interactive and editable within the context of a resume editor application.
export const CustomTypography = withEditableField(BaseTypography);
