import { IPortfolioItem } from "@/types/portfolio";
import { CardComponent } from "@/components/resume/components/cards/CardComponent";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";

interface ProjectCardComponentProps extends IPortfolioItem {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
  activeInlineFieldId?: string | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDelete?: () => void;
  isEditMode?: boolean;
}

export const ProjectCardComponent = (item: ProjectCardComponentProps) => {
  return <CardComponent {...item} />;
};
