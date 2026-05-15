import React, { useCallback } from "react";
import { Box, BoxProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";

export interface ICustomBoxProps extends IEditorProps {
  props: BoxProps;
  children: React.ReactNode;
  targetFieldId: string;
  targetSectionId?: string;
}

// All the Custom React Element should have a editable state, which is determined by the presence of editorProps and its isEditMode property. When in editable state, the component should provide visual cues (like outlines or hover effects) to indicate that it can be interacted with for editing purposes. The activeInlineFieldId can be used to determine which specific field is currently being edited, allowing for targeted styling and interactions.
export const CustomBox = React.memo(
  (
    {
      children,
      props,
      targetFieldId,
      targetSectionId,
      editorProps,
    }: ICustomBoxProps,
    prevProps: ICustomBoxProps,
  ) => {
    const { activeInlineFieldId, onInlineFieldClick } = editorProps || {};
    const isActive = activeInlineFieldId === targetFieldId;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (onInlineFieldClick) {
          event.stopPropagation();
          onInlineFieldClick(
            targetSectionId as any,
            targetFieldId as any,
            event.currentTarget,
          );
        }
      },
      [onInlineFieldClick, targetFieldId, targetSectionId],
    );

    return (
      <Box
        {...props}
        onClick={onInlineFieldClick ? handleClick : props.onClick}
        sx={{
          ...props.sx,
          cursor: onInlineFieldClick ? "pointer" : "inherit",
          outline: isActive
            ? "2px solid rgba(20, 184, 166, 0.9)"
            : "2px solid transparent",
          outlineOffset: 2,
          transition: "outline-color 160ms ease, box-shadow 160ms ease",
          "&:hover": onInlineFieldClick
            ? {
                outlineColor: "rgba(20, 184, 166, 0.55)",
                boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
              }
            : {},
        }}
      >
        {children}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better memoization
    return (
      prevProps.targetFieldId === nextProps.targetFieldId &&
      prevProps.targetSectionId === nextProps.targetSectionId &&
      prevProps.children === nextProps.children &&
      prevProps.editorProps?.activeInlineFieldId ===
        nextProps.editorProps?.activeInlineFieldId &&
      prevProps.editorProps?.onInlineFieldClick ===
        nextProps.editorProps?.onInlineFieldClick
    );
  },
);

CustomBox.displayName = "CustomBox";
