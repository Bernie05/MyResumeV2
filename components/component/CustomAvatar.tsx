import { Avatar, AvatarProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import React from "react";

export interface ICustomAvatarProps extends IEditorProps {
  props: AvatarProps;
  photoURL?: string;
  targetFieldId?: string;
}

export const CustomAvatar = ({
  props,
  photoURL,
  targetFieldId,
  editorProps,
}: ICustomAvatarProps) => {
  const { isEditMode, activeInlineFieldId } = editorProps || {};

  const getAvatar = React.useMemo(() => {
    if (!photoURL) return null;

    console.log("Rendering Avatar with URL:", photoURL);

    return (
      <Avatar
        {...props}
        sx={{
          ...props.sx,
          outline:
            activeInlineFieldId === targetFieldId
              ? "2px solid rgba(20, 184, 166, 0.9)"
              : "2px solid transparent",
          "&:hover": {
            transform: "scale(1.05)",
            ...(isEditMode && {
              outlineColor: "rgba(20, 184, 166, 0.55)",
              boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
            }),
          },
        }}
      >
        {photoURL}
      </Avatar>
    );
  }, [photoURL]);

  return getAvatar;
};
