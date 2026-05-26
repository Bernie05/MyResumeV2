import { IPortfolioItem } from "@/types/portfolio";
// import { CardComponent } from "@/components/component/CustomCardComponent";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";

interface ProjectCardComponentProps extends IPortfolioItem {
  inlineSection?: ResumeEditableSection;
  itemIndex?: number;
}

export const ProjectCardComponent = ({
  ...item
}: ProjectCardComponentProps) => {
  return null; // Placeholder until component is implemented
  // return <CardComponent {...item} />;
};
