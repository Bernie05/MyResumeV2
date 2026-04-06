export interface IPortfolioItem {
  id: number;
  title?: string;
  description?: string;
  longDescription?: string;
  category?: string;
  technologies?: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  results?: string[];
  testimonial?: string;
  client?: string;

  // For Projects
  name?: string;
  link?: string;
  caseStudy?: string;
}
