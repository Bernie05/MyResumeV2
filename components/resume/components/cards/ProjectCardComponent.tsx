import { IPortfolioItem } from "@/types/portfolio";
import { CardComponent } from "@/components/component/CustomCardComponent";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { IEditorProps } from "@/components/secret/SecretResumeEditor";
import { PortfolioItem, ProjectItem } from "@/types/resume";

interface ProjectCardComponentProps extends IPortfolioItem, IEditorProps {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
}

export const ProjectCardComponent = ({
  editorProps,
  ...item
}: ProjectCardComponentProps) => {
  return <CardComponent {...item} editorProps={editorProps} />;
};
