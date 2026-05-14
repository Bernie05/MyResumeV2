import { getSectionPalette } from "@/theme/sectionPalette";
import { Button, ButtonProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import { useThemeContext } from "@/context/ThemeContext";
import { ResumeEditableSection } from "../resume/ResumePage";
import { InlineEditableFieldId } from "../secret/constants/constant";
import { getCursorPointer } from "../secret/utils/componentUtil";

interface CustomButtonProps extends IEditorProps {
  props: ButtonProps;
  children: React.ReactNode;
  // Reference for identifying the section and field
  targetSectionId: ResumeEditableSection;
  targetFieldId: InlineEditableFieldId;
}

export const CustomButton = ({
  props,
  children,
  editorProps,
  // consumer will pass these two props to identify which field is being edited when onInlineFieldClick is triggered
  targetSectionId,
  targetFieldId,
}: CustomButtonProps) => {
  const theme = useThemeContext();
  const { buttonHoverGradient } = getSectionPalette(theme.isDarkMode);
  const { onInlineFieldClick, activeInlineFieldId, isEditMode } =
    editorProps || {};
  const cursor = getCursorPointer(isEditMode);

  return (
    <Button
      {...props}
      sx={{
        ...props.sx,
        cursor,
        outline:
          activeInlineFieldId === targetFieldId
            ? "2px solid rgba(20, 184, 166, 0.9)"
            : "2px solid transparent",
        "&:hover": {
          background: buttonHoverGradient,
          ...(onInlineFieldClick && {
            outlineColor: "rgba(20, 184, 166, 0.55)",
            boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
          }),
        },
      }}
      // Action
      {...(onInlineFieldClick && {
        onClick: (event: React.MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick(
            targetSectionId,
            targetFieldId,
            event.currentTarget as HTMLElement,
          );
        },
        role: "button",
        tabIndex: 0,
      })}
    >
      {children}
    </Button>
  );
};
