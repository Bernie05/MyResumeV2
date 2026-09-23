export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  backgroundUrl: string;
  summary: string;
  dateOfBirth?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  hireButtonText?: string;
  downloadButtonText?: string;
  social?: SocialMediaLink[];
}

export interface SocialMediaLink {
  label: string;
  icon?: string;
  href?: string;
  url?: string;
}

export interface ResumeStats {
  yearsExperience: number;
  projects: number;
  clients: number;
  awards: number;
  custom?: Array<{ label: string; value: number; suffix?: string }>;
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
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
  icon?: string;
  subtitle?: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  proficiency: number;
  icon?: string;
}

export interface ServiceCard {
  id: number;
  title: string;
  subtitle?: string;
  icon?: string;
  items: ServiceItem[];
}

export interface CertificationItem {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

export interface TestimonialItem {
  id: number;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany?: string;
  photoUrl?: string;
}

export interface CharacterReferenceItem {
  id: number;
  name: string;
  company: string;
  position: string;
  contactNo: string;
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
  socialMedia: SocialMediaLink[];
  stats: ResumeStats;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  services: ServiceCard[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  characterReferences: CharacterReferenceItem[];
  declaration?: string;
  servicesBadge?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  experienceBadge?: string;
  experienceTitle?: string;
  portfolioBadge?: string;
  portfolioTitle?: string;
  portfolioSubtitle?: string;
  projectsBadge?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  educationBadge?: string;
  educationTitle?: string;
  skillsBadge?: string;
  skillsTitle?: string;
  skillsSubtitle?: string;
  certificationsBadge?: string;
  certificationsTitle?: string;
  testimonialsBadge?: string;
  testimonialsTitle?: string;
  characterReferencesBadge?: string;
  characterReferencesTitle?: string;
  contactBadge?: string;
  contactTitle?: string;
  contactSubtitle?: string;
}
