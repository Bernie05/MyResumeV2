import type { PortfolioItem, ProjectItem } from "@/types/resume";

export type IPortfolioItem = Partial<
  Omit<PortfolioItem, "id"> & Omit<ProjectItem, "id">
> & {
  id: number;
};
