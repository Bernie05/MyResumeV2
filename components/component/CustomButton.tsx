import React from "react";
import { Button, ButtonProps, SxProps } from "@mui/material";

import { withEditableField } from "../hoc/withEditableField";

interface CustomButtonProps extends Omit<ButtonProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

// CustomButton is a React component that wraps the MUI Button component and enhances it with editable field functionality. It accepts standard ButtonProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
const BaseButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        sx={{
          ...sx,
        }}
        {...props}
      />
    );
  },
);

BaseButton.displayName = "BaseButton";

// Wrap the BaseButton component with the withEditableField HOC to create the CustomButton component, which includes editable field functionality. This allows the button to be interactive and editable within the context of a resume editor application.
export const CustomButton = withEditableField(BaseButton);
