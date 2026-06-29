import React, { useMemo } from "react";
import { SxProps } from "@mui/material";
import {
  useIsEditMode,
  useActiveField,
  useOnFieldClick,
} from "../../hook/useEditor";
import type { ResumeEditableSection } from "../resume/ResumePage";
import type { InlineEditableFieldId } from "../secret/constants/constant";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";

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

// Higher-Order Component to wrap any component with editable field functionality
export const withEditableField = <P extends WithEditableFieldProps>(
  Component: React.ComponentType<P>,
  defaultSx?: SxProps,
) => {
  const WithEditableComponent = React.memo(
    ({ targetFieldId, targetSectionId, sx, onClick, ...props }: P) => {
      const { theme } = useThemeContext();

      // Hooks to access editor state and interactions
      const isEditMode = useIsEditMode();
      const activeFieldId = useActiveField();
      const onFieldClickHandler = useOnFieldClick();
      const isActiveField = activeFieldId === targetFieldId;

      // Memoize the combined styles to avoid unnecessary re-renders
      const combinedSx = useMemo(() => {
        const color = theme.palette.text.primary;

        // CSS set.
        const outline =
          isEditMode && isActiveField
            ? "2px solid rgba(20, 184, 166, 0.9)"
            : "";
        const cursor = isEditMode ? "pointer" : "inherit";
        const outlineColor =
          isEditMode && isActiveField
            ? "2px solid rgba(20, 184, 166, 0.9)"
            : "inherit";
        const boxShadow =
          isEditMode && isActiveField
            ? "0 0 0 4px rgba(20, 184, 166, 0.2)"
            : "none";

        let css = {};

        if (isEditMode) {
          css = {
            // Apply editable styles only in edit mode
            color,
            cursor,
            // Show outline for active field (clicked)
            ...(isActiveField && {
              outline,
              outlineColor,
              outlineOffset: 2,
            }),
            // Merge user sx with default editable styles, allowing user to override if needed
            ...sx,
            ...defaultSx,
          };
        } else {
          css = {
            // In view mode, we don't want any editable styles, but we still want to allow user sx to apply
            cursor,
            color,
            // In view mode, we don't want any editable styles, but we still want to allow user sx to apply
            ...defaultSx,
            ...sx,
          };
        }

        return css;
      }, [activeFieldId, targetFieldId, isEditMode, sx, defaultSx, theme]);

      const handleClick = React.useCallback(
        (event: React.MouseEvent<any>) => {
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
          if (onFieldClickHandler && targetFieldId && targetSectionId) {
            onFieldClickHandler(
              targetSectionId,
              targetFieldId,
              event.currentTarget as HTMLElement,
            );
          }
        },
        [isEditMode, onFieldClickHandler, targetFieldId, targetSectionId],
      );

      const handleMouseEnter = React.useCallback(
        (event: React.MouseEvent<any>) => {
          // Only allow hover effects in edit mode
          if (!isEditMode) {
            return;
          }

          // apply css in sx for hover effect, this is not takeEffect
          const hoverStyles = {
            outline: "2px solid rgb(0, 255, 225)",
            boxShadow: "0 0 0 2px rgb(0, 255, 225)",
          };
          // Apply hover styles directly to the element
          const target = event.currentTarget as HTMLElement;
          Object.assign(target.style, hoverStyles);
        },
        [isEditMode],
      );

      const handleMouseLeave = React.useCallback(
        (event: React.MouseEvent<any>) => {
          if (!isEditMode) {
            return;
          }

          // Remove hover styles when mouse leaves
          const target = event.currentTarget as HTMLElement;
          target.style.outline = "";
          target.style.boxShadow = "";
        },
        [isEditMode],
      );

      // Render the wrapped component with combined styles and click handler
      return (
        <Component
          {...(props as P)}
          sx={combinedSx}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    },
  );

  // Set display name for easier debugging
  WithEditableComponent.displayName = `WithEditableField(${Component.displayName || Component.name || "Component"})`;

  return WithEditableComponent;
};
