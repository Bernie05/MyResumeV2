import React, { useMemo } from "react";
import { SxProps } from "@mui/material";
import {
  useIsEditMode,
  useActiveField,
  useOnFieldClick,
  useFieldEditorState,
} from "../../hook/useEditor";

import type {
  ResumeEditableSection,
  InlineEditableFieldId,
} from "../secret/SecretResumeEditor";

export interface WithEditableFieldProps {
  // The field ID this component represents (e.g., 'personalInfo.name')
  targetFieldId?: InlineEditableFieldId;
  // The section ID for additional context (e.g., 'personalInfo')
  targetSectionId?: ResumeEditableSection;
  // Additional styles to merge with default editable styles
  sx?: SxProps;
  // Custom click handler
  onClick?: (event: React.MouseEvent<any>) => void;
}

export const withEditableField = <P extends WithEditableFieldProps>(
  Component: React.ComponentType<P>,
  defaultSx?: SxProps,
) => {
  const WithEditableComponent = React.memo(
    ({ targetFieldId, targetSectionId, sx, onClick, ...props }: P) => {
      // Hooks to access editor state and interactions
      const isEditMode = useIsEditMode();
      const activeFieldId = useActiveField();
      const onFieldClickHandler = useOnFieldClick();
      const {
        outline,
        cursor,
        hover: { outlineColor, boxShadow },
      } = useFieldEditorState(targetFieldId || "");

      console.log("Edit Mode:", { isEditMode, targetFieldId, activeFieldId });

      // Memoize the combined styles to avoid unnecessary re-renders
      const combinedSx = useMemo(() => {
        // In read mode, keep original styles without hover effects
        if (!isEditMode) {
          return {
            ...defaultSx,
            ...sx,
            cursor: "auto",
          };
        }

        // In edit mode, show outline on hover for all fields
        return {
          ...defaultSx,
          cursor: "pointer",
          transition: "outline-color 160ms ease, box-shadow 160ms ease",
          // Show outline on hover
          "&:hover": {
            outline,
            outlineColor,
            boxShadow,
            outlineOffset: 2,
          },
          // Show outline for active field (clicked)
          ...(activeFieldId === targetFieldId && {
            outline,
            outlineColor,
            outlineOffset: 2,
          }),
          // Merge with Component styles
          ...sx,
        };
      }, [
        activeFieldId,
        targetFieldId,
        isEditMode,
        sx,
        defaultSx,
        outline,
        outlineColor,
        boxShadow,
      ]);

      const handleClick = (event: React.MouseEvent<any>) => {
        // Call custom onClick handler first
        if (onClick) {
          onClick(event);
        }

        // Only allow click handling in edit mode
        if (!isEditMode) {
          return;
        }

        event.stopPropagation(); // Prevent event bubbling to parent sections

        // Trigger the onFieldClick callback which will open the modal
        // and update the editor context (selectedInlineFieldId, selectedPreviewSection, anchorEl)
        if (onFieldClickHandler && targetFieldId) {
          onFieldClickHandler(
            targetSectionId,
            targetFieldId,
            event.currentTarget as HTMLElement,
          );
        }
      };

      // Render the wrapped component with combined styles and click handler
      return (
        <Component {...(props as P)} sx={combinedSx} onClick={handleClick} />
      );
    },
  );

  // Set display name for easier debugging
  WithEditableComponent.displayName = `WithEditableField(${Component.displayName || Component.name || "Component"})`;

  return WithEditableComponent;
};
