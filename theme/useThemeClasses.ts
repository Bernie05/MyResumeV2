/**
 * Custom hook to get theme-related classes
 * Reduces code duplication in components
 */

import { useThemeContext } from "@/context/ThemeContext";
import {
  THEME_TAILWIND,
  getThemeClass,
  getSectionHeaderClass,
  ICON_COLORS,
} from "./constants";

// Main hook to get theme classes
export const useThemeClasses = () => {
  const { isDarkMode } = useThemeContext();
  const themeMode = isDarkMode ? "dark" : "light";

  // Get the current theme's Tailwind classes
  const theme = THEME_TAILWIND[themeMode];

  return {
    /**
     * Get a class string based on theme
     */
    cx: (lightClass: string, darkClass: string): string => {
      return getThemeClass(isDarkMode, lightClass, darkClass);
    },

    /**
     * Get theme-based tailwind classes
     */
    tw: theme,

    /**
     * Section header styling
     */
    sectionHeader: getSectionHeaderClass(isDarkMode),

    /**
     * Icon colors
     */
    iconColor: ICON_COLORS[themeMode],

    /**
     * Card styling - defined in constants
     */
    card: {
      base: theme.card.base,
      hover: theme.card.hover,
      interactive: theme.card.interactive,
      padding: theme.card.padding,
    },

    /**
     * Input styling - defined in constants
     */
    input: {
      base: theme.input.base,
      focus: theme.input.focus,
    },

    /**
     * Button styling - defined in constants
     */
    button: {
      primary: theme.button.primary,
      secondary: theme.button.secondary,
    },

    /**
     * Badge/pill styling - defined in constants
     */
    badge: {
      primary: theme.badge.primary,
      secondary: theme.badge.secondary,
    },

    /**
     * Divider styling - defined in constants
     */
    divider: theme.divider,

    /**
     * Text colors - defined in constants
     */
    text: {
      primary: theme.text.primary,
      secondary: theme.text.secondary,
      tertiary: theme.text.tertiary,
      accent: theme.text.accent,
    },

    /**
     * Background colors - defined in constants
     */
    bg: {
      primary: theme.bg.primary,
      secondary: theme.bg.secondary,
      tertiary: theme.bg.tertiary,
      accent: theme.bg.accent,
    },

    /**
     * Portfolio component styling
     */
    portfolio: theme.portfolio,
  };
};
