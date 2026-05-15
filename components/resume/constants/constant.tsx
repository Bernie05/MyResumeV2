import DownloadIcon from "@mui/icons-material/Download";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import TwitterIcon from "@mui/icons-material/Twitter";
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
export const socialLinks = [
  { icon: "facebook", href: "#/facebook", label: "Facebook" },
  { icon: "twitter", href: "#/twitter", label: "Twitter" },
  {
    icon: "linkedin",
    href: "#/linkedin",
    label: "LinkedIn",
  },
  { icon: "instagram", href: "#/instagram", label: "Instagram" },
];

export const statItems: StatsItems[] = [
  { key: "yearsExperience", label: "Years Experience", suffix: "+" },
  { key: "projects", label: "Completed Projects" },
  { key: "clients", label: "Happy Clients" },
  { key: "awards", label: "Honors and Awards", suffix: "+" },
];
