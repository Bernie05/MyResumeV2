import { Typography, TypographyProps } from "@mui/material";
import { IEditorProps } from "../secret/SecretResumeEditor";
import {
  createInlineFieldProps,
  getInlineFieldSxV2,
} from "../secret/utils/componentUtil";
import { InlineEditableFieldId } from "../secret/constants/constant";
import { ResumeEditableSection } from "../resume/ResumePage";

interface ICustomTypographyProps extends IEditorProps {
  props: TypographyProps;
  children: React.ReactNode;
  targetSectionId?: ResumeEditableSection;
  targetFieldId: InlineEditableFieldId;
}

export const CustomTypography = ({
  props,
  children,
  editorProps,
  targetSectionId,
  targetFieldId,
}: ICustomTypographyProps) => {
  const { activeInlineFieldId, isEditMode, onInlineFieldClick } =
    editorProps || {};

  const inlineFieldClick = onInlineFieldClick as
    | ((
        section: ResumeEditableSection,
        fieldId: string,
        anchor?: HTMLElement,
      ) => void)
    | undefined;

  const inlineFieldProps = {
    ...(targetSectionId &&
      createInlineFieldProps(targetSectionId, targetFieldId, inlineFieldClick)),
  };

  return (
    <Typography
      {...props}
      sx={{
        ...props.sx,
        ...getInlineFieldSxV2({
          fieldId: targetFieldId,
          activeInlineFieldId,
          isEditMode,
        }),
      }}
      {...inlineFieldProps}
    >
      {children}
    </Typography>
  );
};
