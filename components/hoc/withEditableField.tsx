import React, { useMemo } from "react";
import { SxProps } from "@mui/material";
import {
  useIsEditMode,
  useActiveField,
  useOnFieldClick,
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
      const onFieldClick = useOnFieldClick();

      // Memoize the combined styles to avoid unnecessary re-renders
      const combinedSx = useMemo(
        () => ({
          ...defaultSx,
          // Core Editable field styles
          outline:
            activeFieldId === targetFieldId
              ? "2px solid rgba(20, 184, 166, 0.9)"
              : "2px solid transparent",
          cursor: isEditMode ? "pointer" : "inherit",
          transition: "outline-color 160ms ease, box-shadow 160ms ease",
          outlineOffset: 2,

          // hover state
          "&:hover": {
            outlineColor:
              activeFieldId === targetFieldId
                ? "rgba(20, 184, 166, 0.9)"
                : isEditMode
                  ? "rgba(20, 184, 166, 0.4)"
                  : "inherit",
            boxShadow:
              activeFieldId === targetFieldId && isEditMode
                ? "0 0 0 4px rgba(20, 184, 166, 0.2)"
                : "none",
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
