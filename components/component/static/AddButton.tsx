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
  const { isDarkMode } = useThemeContext();
  const { primaryAccent, softBackground } = getSectionPalette(isDarkMode);
  const { onAddAction } = useEditor() || {};

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
