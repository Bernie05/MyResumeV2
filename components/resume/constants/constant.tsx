import { HeroStats, StatsItems } from "../HeroSection";

/** Navbar const */
export const navbarId = "navbar";
export const websiteTitle = "My Resume";
export const secretEditor = "/secret";
export const editorBtn = "Editor";
export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/** Hero section */
export const heroSectionId = "hero-section";

export const statItems: StatsItems[] = [
  { key: "yearsExperience", label: "Years Experience", suffix: "+" },
  { key: "projects", label: "Completed Projects" },
  { key: "clients", label: "Happy Clients" },
  { key: "awards", label: "Honors and Awards", suffix: "+" },
];
