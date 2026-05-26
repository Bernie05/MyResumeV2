/**
 * Component utilities for common rendering patterns and helpers
 */
import React from "react";
import { BoxProps } from "@mui/material";
import { ResumeEditableSection } from "../resume/ResumePage";

/**
 * Safely handles inline field editing with event delegation
 */
export const createFieldClickHandler = (
  onInlineFieldClick: (
    sectionId: string,
    fieldId: string,
    element: HTMLElement,
  ) => void,
  sectionId: string,
  fieldId: string,
) => {
  return (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onInlineFieldClick(sectionId, fieldId, event.currentTarget);
  };
};

/**
 * Generates styling for active/editable field states
 */
export const getEditableFieldStyles = (
  isActive: boolean,
  isEditable: boolean = false,
) => ({
  cursor: isEditable ? "pointer" : "inherit",
  outline: isActive
    ? "2px solid rgba(20, 184, 166, 0.9)"
    : "2px solid transparent",
  outlineOffset: 2,
  transition: "outline-color 160ms ease, box-shadow 160ms ease",
  ...(isEditable && {
    "&:hover": {
      outlineColor: "rgba(20, 184, 166, 0.55)",
      boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
    },
  }),
});

/**
 * Merges custom sx with editable field styles
 */
export const mergeEditableStyles = (
  customSx: BoxProps["sx"] = {},
  isActive: boolean,
  isEditable: boolean = false,
) => {
  const editableStyles = getEditableFieldStyles(isActive, isEditable);
  return {
    ...editableStyles,
    ...(typeof customSx === "object" ? customSx : {}),
  };
};
