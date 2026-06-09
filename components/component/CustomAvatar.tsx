import React from "react";
import { Avatar, AvatarProps, SxProps } from "@mui/material";
import { withEditableField } from "../hoc/withEditableField";
interface CustomAvatarProps extends Omit<AvatarProps, "sx"> {
  sx?: SxProps;
  children?: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseAvatar = React.forwardRef<HTMLDivElement, CustomAvatarProps>(
  ({ sx, ...props }, ref) => {
    return (
      <Avatar
        ref={ref}
        sx={{
          ...sx,
        }}
        {...props}
      />
    );
  },
);

export const CustomAvatar = withEditableField(BaseAvatar);
