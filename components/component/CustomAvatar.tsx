import React from "react";
import { Avatar, AvatarProps, SxProps } from "@mui/material";
import { withEditableField } from "../hoc/withEditableField";

interface CustomAvatarProps extends Omit<AvatarProps, "sx"> {
  sx?: SxProps;
  children?: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

// CustomAvatar is a React component that wraps the MUI Avatar component and enhances it with editable field functionality. It accepts standard AvatarProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
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

BaseAvatar.displayName = "BaseAvatar";

// Wrap the BaseAvatar component with the withEditableField HOC to create the CustomAvatar component, which includes editable field functionality.
// This allows the avatar to be interactive and editable within the context of a resume editor application.
export const CustomAvatar = withEditableField(BaseAvatar);
