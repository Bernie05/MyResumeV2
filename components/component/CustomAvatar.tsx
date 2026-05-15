import React, { useCallback, useMemo } from "react";
import { Avatar, AvatarProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";

export interface ICustomAvatarProps extends IEditorProps {
  props: AvatarProps;
  photoURL?: string;
  targetFieldId?: string;
  targetSectionId?: string;
}

export const CustomAvatar = React.memo(
  ({
    props,
    photoURL,
    targetFieldId,
    targetSectionId,
    editorProps,
  }: ICustomAvatarProps) => {
    const { isEditMode, activeInlineFieldId, onInlineFieldClick } =
      editorProps || {};
    const isActive = activeInlineFieldId === targetFieldId;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (onInlineFieldClick && !isEditMode) {
          event.stopPropagation();
          onInlineFieldClick(
            targetSectionId as any,
            targetFieldId as any,
            event.currentTarget,
          );
        }
      },
      [onInlineFieldClick, targetFieldId, targetSectionId, isEditMode],
    );

    const avatarSx = useMemo(
      () => ({
        ...props.sx,
        cursor: onInlineFieldClick && !isEditMode ? "pointer" : "inherit",
        outline: isActive
          ? "2px solid rgba(20, 184, 166, 0.9)"
          : "2px solid transparent",
        outlineOffset: 2,
        transition:
          "transform 0.2s ease, outline-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "scale(1.05)",
          ...(onInlineFieldClick && !isEditMode
            ? {
                outlineColor: "rgba(20, 184, 166, 0.55)",
                boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
              }
            : {}),
        },
      }),
      [props.sx, isActive, onInlineFieldClick, isEditMode],
    );

    if (!photoURL) return null;

    return (
      <Avatar
        {...props}
        onClick={
          onInlineFieldClick && !isEditMode ? handleClick : props.onClick
        }
        sx={avatarSx}
        src={photoURL}
        alt={props.alt || "avatar"}
      />
    );
  },
  // Call back for custom comparison to optimize re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.photoURL === nextProps.photoURL &&
      prevProps.targetFieldId === nextProps.targetFieldId &&
      prevProps.targetSectionId === nextProps.targetSectionId &&
      prevProps.editorProps?.activeInlineFieldId ===
        nextProps.editorProps?.activeInlineFieldId &&
      prevProps.editorProps?.onInlineFieldClick ===
        nextProps.editorProps?.onInlineFieldClick
    );
  },
);

CustomAvatar.displayName = "CustomAvatar";
