import React, { useCallback, useMemo } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { InlineEditableFieldId } from "../secret/constants/constant";
import { ResumeEditableSection } from "../resume/ResumePage";

interface ICustomTypographyProps extends IEditorProps {
  props: TypographyProps;
  children: React.ReactNode;
  targetSectionId?: ResumeEditableSection;
  targetFieldId: InlineEditableFieldId;
}

export const CustomTypography = React.memo(
  ({
    props,
    children,
    editorProps,
    targetSectionId,
    targetFieldId,
  }: ICustomTypographyProps) => {
    const { activeInlineFieldId, isEditMode, onInlineFieldClick } =
      editorProps || {};
    const isActive = activeInlineFieldId === targetFieldId;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (onInlineFieldClick) {
          event.stopPropagation();
          onInlineFieldClick(
            targetSectionId!,
            targetFieldId,
            event.currentTarget,
          );
        }
      },
      [onInlineFieldClick, targetFieldId, targetSectionId],
    );

    const typographySx = useMemo(
      () => ({
        ...props.sx,
        cursor: onInlineFieldClick && !isEditMode ? "pointer" : "inherit",
        outline: isActive
          ? "2px solid rgba(20, 184, 166, 0.9)"
          : "2px solid transparent",
        outlineOffset: 2,
        transition: "outline-color 160ms ease, box-shadow 160ms ease",
        borderRadius: "0.25rem",
        "&:hover":
          onInlineFieldClick && !isEditMode
            ? {
                outlineColor: "rgba(20, 184, 166, 0.55)",
                ...(isActive && {
                  boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
                }),
              }
            : {},
      }),
      [props.sx, onInlineFieldClick, isEditMode, isActive],
    );

    return (
      <Typography
        {...props}
        onClick={onInlineFieldClick ? handleClick : props.onClick}
        sx={typographySx}
      >
        {children}
      </Typography>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.targetFieldId === nextProps.targetFieldId &&
      prevProps.targetSectionId === nextProps.targetSectionId &&
      prevProps.children === nextProps.children &&
      prevProps.editorProps?.activeInlineFieldId ===
        nextProps.editorProps?.activeInlineFieldId &&
      prevProps.editorProps?.isEditMode === nextProps.editorProps?.isEditMode
    );
  },
);

CustomTypography.displayName = "CustomTypography";
