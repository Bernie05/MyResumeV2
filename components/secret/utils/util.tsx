import {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioItem,
  ProjectItem,
  ResumeData,
  SkillCategory,
  SkillItem,
} from "@/types/resume";

/**
 * Deep clones the resume data to prevent direct mutations.
 * @param data Resume interface
 * @returns object
 */
export const cloneResumeData = (data: ResumeData): ResumeData => {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
};

/**
 * Converts a newline-separated string into an array of trimmed, non-empty lines.
 * @param value The input string
 * @returns An array of non-empty, trimmed lines
 */
export const textToLines = (value: string): string[] => {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Converts an array of strings into a single string with each item separated by a newline character.
 * @param value The array of strings
 * @returns A single string with each item separated by a newline character
 */
export const linesToText = (value: string[]): string => {
  return value.join("\n");
};

export const textToCsv = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const csvToText = (value: string[]): string => {
  return value.join(", ");
};

export const getNextId = (items: Array<{ id: number }>): number => {
  return items.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
};

export const clampProficiency = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

export const replaceItemAtIndex = <T,>(
  items: T[],
  index: number,
  nextItem: T,
): T[] => {
  return items.map((item, currentIndex) =>
    currentIndex === index ? nextItem : item,
  );
};

export const removeItemAtIndex = <T,>(items: T[], index: number): T[] => {
  return items.filter((_, currentIndex) => currentIndex !== index);
};

export const createEmptyExperienceItem = (
  items: ExperienceItem[],
): ExperienceItem => {
  return {
    id: getNextId(items),
    company: "",
    position: "",
    duration: "",
    location: "",
    description: [],
  };
};

export const createEmptyEducationItem = (
  items: EducationItem[],
): EducationItem => {
  return {
    id: getNextId(items),
    school: "",
    degree: "",
    field: "",
    year: "",
    location: "",
  };
};

export const createEmptyProjectItem = (items: ProjectItem[]): ProjectItem => {
  return {
    id: getNextId(items),
    name: "",
    description: "",
    technologies: [],
    link: "",
    image: "",
    demoUrl: "",
    caseStudy: "",
  };
};

export const createEmptyPortfolioItem = (
  items: PortfolioItem[],
): PortfolioItem => {
  return {
    id: getNextId(items),
    title: "",
    description: "",
    longDescription: "",
    category: "",
    technologies: [],
    image: "",
    demoUrl: "",
    githubUrl: "",
    results: [],
    testimonial: "",
    client: "",
  };
};

export const createEmptyCertificationItem = (
  items: CertificationItem[],
): CertificationItem => {
  return {
    id: getNextId(items),
    name: "",
    issuer: "",
    year: "",
  };
};

export const createEmptySkillCategory = (): SkillCategory => {
  return {
    category: "",
    items: [{ name: "", proficiency: 50 }],
  };
};

export const createEmptySkillItem = (): SkillItem => {
  return {
    name: "",
    proficiency: 50,
  };
};
