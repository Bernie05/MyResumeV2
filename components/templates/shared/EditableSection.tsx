"use client";

import type { ElementType, MouseEvent, ReactNode } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import {
  useEditor,
  useActiveSection,
  useIsEditMode,
  useOnSectionClick,
} from "@/hook/useEditor";
import { editAccent } from "@/theme/editAccent";
import { useIsSectionHidden } from "./sectionVisibility";
import { createSectionProps } from "@/components/secret/utils/componentUtil";

interface EditableSectionProps {
  sectionId: ResumeEditableSection;
  children: ReactNode;
  component?: ElementType;
  domId?: string;
  /** Forces section interactivity on/off; defaults to the editor's edit mode. */
  interactive?: boolean;
  sx?: SxProps<Theme>;
}

// Wraps a top-level resume section so the whole section is clickable (and
// outlined when active) in the editor. Shared by every template so section
// selection behaves the same regardless of design.
export const EditableSection = ({
  sectionId,
  children,
  component = "div",
  domId = sectionId,
  interactive,
  sx,
}: EditableSectionProps) => {
  const isEditMode = useIsEditMode();
  const activeSection = useActiveSection();
  const onSectionClick = useOnSectionClick();

  const isHidden = useIsSectionHidden(sectionId);
  const onToggleHidden = useEditor().onToggleSectionHidden;
  const isInteractive = interactive ?? isEditMode;
  const isActive = activeSection === sectionId;

  // Hidden sections vanish on the public page; the owner still sees them dimmed.
  if (isHidden && !isEditMode) return null;

  return (
    <Box
      id={domId}
      component={component}
      sx={[
        {
          borderRadius: isInteractive ? { xs: 4, md: 5 } : undefined,
          outline:
            isInteractive && isActive
              ? `2px solid ${editAccent(90)}`
              : "2px solid transparent",
          outlineOffset: 8,
          scrollMarginTop: { xs: 88, md: 104 },
          transition: "outline-color 160ms ease, box-shadow 160ms ease",
          position: isHidden ? "relative" : undefined,
          "&:hover": isInteractive
            ? {
                outlineColor: editAccent(55),
                boxShadow: isActive
                  ? `0 0 0 6px ${editAccent(20)}`
                  : `0 0 0 4px ${editAccent(12)}`,
              }
            : undefined,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...createSectionProps(isInteractive, sectionId, onSectionClick)}
    >
      {isHidden ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "rgba(15, 23, 42, 0.92)",
              fontFamily: "inherit",
            }}
          >
            Hidden
            <Box
              component="button"
              type="button"
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                onToggleHidden?.(sectionId);
              }}
              sx={{
                font: "inherit",
                fontWeight: 700,
                color: "#fff",
                background: "none",
                border: "none",
                p: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Show
            </Box>
          </Box>
          <Box sx={{ opacity: 0.4 }}>{children}</Box>
        </>
      ) : (
        children
      )}
    </Box>
  );
};
