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

// CustomBox is a React component that wraps the MUI Box component and enhances it with editable field functionality. It accepts standard BoxProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
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

BaseBox.displayName = "BaseBox";

// Wrap the BaseBox component with the withEditableField HOC to create the CustomBox component, which includes editable field functionality. This allows the box to be interactive and editable within the context of a resume editor application.
export const CustomBox = withEditableField(BaseBox);
