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
  // determine if active or not 3 condiotion

  const WithEditableComponent = React.memo(
    ({ targetFieldId, targetSectionId, sx, onClick, ...props }: P) => {
      console.log(
        " targetFieldId, targetSectionId",
        targetFieldId,
        targetSectionId,
      );

      console.log("sx: ", sx);

      // Hooks to access editor state and interactions
      const isEditMode = useIsEditMode();
      const activeFieldId = useActiveField();
      const onFieldClick = useOnFieldClick();
      const {
        outline,
        cursor,
        hover: { outlineColor, boxShadow },
      } = useFieldEditorState(targetFieldId || "");

      // Memoize the combined styles to avoid unnecessary re-renders
      const combinedSx = useMemo(
        () => ({
          ...defaultSx,
          // Core Editable field styles
          outline,
          cursor,
          transition: "outline-color 160ms ease, box-shadow 160ms ease",
          outlineOffset: 2,

          // hover state
          "&:hover": {
            outlineColor,
            boxShadow,
          },

          // Merge with Component styles
          ...sx,
        }),
        [activeFieldId, targetFieldId, isEditMode, sx],
      );

      const handleClick = (event: React.MouseEvent<any>) => {
        // Call custom onClick handler first
        if (onClick) {
          onClick(event);
        }

        // Then trigger inline field
        if (onFieldClick && targetFieldId && isEditMode) {
          event.stopPropagation(); // Prevent event bubbling to parent sections
          onFieldClick(
            targetFieldId,
            targetSectionId,
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
