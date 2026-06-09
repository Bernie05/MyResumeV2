import React from "react";
import { Button, ButtonProps, SxProps } from "@mui/material";

import { withEditableField } from "../hoc/withEditableField";

interface CustomButtonProps extends Omit<ButtonProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

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

export const CustomButton = withEditableField(BaseButton);
