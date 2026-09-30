export { archivo } from "@/theme/fonts";

export interface ShowcasePalette {
  paper: string;
  surface: string;
  ink: string;
  body: string;
  muted: string;
  rule: string;
  accent: string;
  onAccent: string;
  focus: string;
}

// One accent (vermilion) locked across the page; warm stone neutrals. Owned by
// Showcase only: Design 1 keeps its own palette (theme/sectionPalette.ts).
// Contrast (WCAG): body/muted text >= 4.5:1 and accent >= 5:1 on paper in both modes.
const PALETTE = {
  light: {
    accent: "#b23a22",
    onAccent: "#fbf7f2",
    paper: "#f3f1ec",
    surface: "#e7e4dd",
    ink: "#17181c",
    body: "#34363c",
    muted: "#5f6168",
    rule: "rgba(23, 24, 28, 0.14)",
  },
  dark: {
    accent: "#ef7552",
    onAccent: "#1a1310",
    paper: "#121316",
    surface: "#1c1d21",
    ink: "#efede8",
    body: "#cfccc5",
    muted: "#9c9a93",
    rule: "rgba(239, 237, 232, 0.14)",
  },
} as const;

export const getShowcasePalette = (isDarkMode: boolean): ShowcasePalette => {
  const p = isDarkMode ? PALETTE.dark : PALETTE.light;
  return { ...p, focus: p.accent };
};

// Motion tokens (motion-design): strong ease-out for enters, press 160ms.
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
export const HOVER_ONLY = "@media (hover: hover) and (pointer: fine)";
export const REDUCED_MOTION = "@media (prefers-reduced-motion: reduce)";

// Radius system: frames 20px, inputs 12px, pills fully rounded.
export const RADIUS = { frame: "20px", input: "12px", pill: "999px" } as const;
