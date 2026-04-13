import { IPortfolioItem } from "@/types/portfolio";
import { CardComponent } from "@/components/cards/CardComponent";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";

interface ProjectCardComponentProps extends IPortfolioItem {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
  activeInlineFieldId?: string | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: string,
    anchor?: HTMLElement,
  ) => void;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
}

export const ProjectCardComponent = (item: ProjectCardComponentProps) => {
  return <CardComponent {...item} />;
};
