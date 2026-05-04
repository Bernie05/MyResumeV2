import { Box, BoxProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";

export interface ICustomBoxProps extends IEditorProps {
  props: BoxProps;
  children: React.ReactNode;
}

// All the Custom React Element should have a editable state, which is determined by the presence of editorProps and its isEditMode property. When in editable state, the component should provide visual cues (like outlines or hover effects) to indicate that it can be interacted with for editing purposes. The activeInlineFieldId can be used to determine which specific field is currently being edited, allowing for targeted styling and interactions.
export const CustomBox = ({
  children,
  props,
  editorProps,
}: ICustomBoxProps) => {
  const { activeInlineFieldId, onInlineFieldClick } = editorProps || {};
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        "&:hover": {
          ...(onInlineFieldClick
            ? {
                outlineColor: "rgba(20, 184, 166, 0.55)",
                boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
              }
            : undefined),
        },
      }}
    >
      {children}
    </Box>
  );
};
