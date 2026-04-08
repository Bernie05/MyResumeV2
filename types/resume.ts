export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  backgroundUrl: string;
  summary: string;
}

export interface ResumeStats {
  yearsExperience: number;
  projects: number;
  clients: number;
  awards: number;
}

export interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
}

export interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

export interface SkillItem {
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface CertificationItem {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
  demoUrl: string;
  caseStudy: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
  results: string[];
  testimonial: string;
  client: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  stats: ResumeStats;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  portfolio: PortfolioItem[];
}
