import { ResumeEditableSection } from "@/components/resume/ResumePage";
import { useThemeContext } from "@/context/ThemeContext";
import { useEditor } from "@/hook/useEditor";
import { getSectionPalette } from "@/theme/sectionPalette";
import { Box, Typography } from "@mui/material";
import React from "react";

interface IAddButtonProps {
  children: React.ReactNode;
  targetSectionId: ResumeEditableSection;
}

export const AddButton = ({ children, targetSectionId }: IAddButtonProps) => {
  // Access the theme context to determine if dark mode is active
  // Retrieve the appropriate color palette for the section
  // Also, access the editor context to handle the add action when the button is clicked.
  const { isDarkMode } = useThemeContext();
  const { primaryAccent, softBackground } = getSectionPalette(isDarkMode);
  const { onAddAction } = useEditor() || {};

  // Render the AddButton component, which is a styled Box that triggers the onAddAction callback when clicked. The button's appearance changes based on the current theme (dark or light mode).
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: `2px dashed ${primaryAccent}50`,
        borderRadius: "1rem",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: primaryAccent,
          background: softBackground,
        },
      }}
      onClick={(event) => {
        event.stopPropagation();
        onAddAction?.(targetSectionId, event.currentTarget as HTMLElement);
      }}
    >
      {children}
    </Box>
  );
};
