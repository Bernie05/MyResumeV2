import { IPortfolioItem } from "@/types/portfolio";
import { CardComponent } from "@/components/cards/CardComponent";

export const ProjectCardComponent = (item: IPortfolioItem) => {
  return <CardComponent {...item} />;
};
