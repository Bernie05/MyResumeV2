/**
 * Theme Constants
 * Centralized theme colors and styling values
 */

export const THEME_COLORS = {
  light: {
    bg: {
      primary: "#ffffff",
      secondary: "#f8f9fa",
      tertiary: "#e9ecef",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#404040",
      tertiary: "#666666",
    },
    accent: {
      primary: "#0066cc",
      secondary: "#0052a3",
      tertiary: "#003d7a",
      gradient: "from-blue-500 to-blue-400",
    },
    border: {
      primary: "#e0e0e0",
      secondary: "#d0d0d0",
    },
    card: {
      bg: "#ffffff",
      border: "border-gray-200",
      shadow: "shadow-blue-500/20",
      hover: "hover:border-blue-400/50",
    },
    button: {
      primary: "#0066cc",
      secondary: "#0052a3",
      text: "#ffffff",
    },
    icon: {
      primary: "text-blue-600",
      accent: "text-blue-400",
      bg: "bg-blue-100",
    },
  },
  dark: {
    bg: {
      primary: "#000000",
      secondary: "#111111",
      tertiary: "#1a1a1a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e0e0e0",
      tertiary: "#b0b0b0",
    },
    accent: {
      primary: "#00cc99",
      secondary: "#00aa88",
      tertiary: "#008866",
      gradient: "from-teal-500 via-amber-400 to-teal-600",
    },
    border: {
      primary: "#333333",
      secondary: "#444444",
    },
    card: {
      bg: "bg-gradient-to-br from-slate-800/80 to-slate-900/80",
      border: "border-teal-500/20",
      shadow: "hover:shadow-teal-500/20",
      hover: "hover:border-teal-500/50",
    },
    button: {
      primary: "#00cc99",
      secondary: "#00aa88",
      text: "#000000",
    },
    icon: {
      primary: "text-blue-600",
      accent: "text-blue-400",
      bg: "bg-blue-100",
    },
  },
};

export const THEME_TAILWIND = {
  light: {
    bg: {
      primary: "bg-white",
      secondary: "bg-gray-50",
      tertiary: "bg-gray-100",
      accent: "bg-blue-50",
    },
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      tertiary: "text-gray-500",
      accent: "text-blue-600",
    },
    card: {
      base: "bg-white border border-gray-200",
      hover: "hover:border-blue-400/50 hover:shadow-blue-500/20",
      interactive:
        "hover:shadow-xl hover:-translate-y-2 transition-all duration-300",
      padding: "p-8 rounded-2xl",
    },
    input: {
      base: "bg-white border border-gray-300 text-gray-900 placeholder-gray-400",
      focus: "focus:border-blue-500 focus:ring-blue-500/20",
    },
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    },
    badge: {
      primary: "bg-blue-100 text-blue-700",
      secondary: "bg-gray-200 text-gray-700",
    },
    divider: "border-gray-300",
    accent: {
      primary: "text-blue-600",
      secondary: "text-blue-500",
      bg: "bg-blue-100",
    },
    portfolio: {
      accentLine: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600",
      card: "bg-white/40 backdrop-blur border border-gray-200/50 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 shadow-lg",
      imageOverlay: "bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/50",
      categoryBadge: "bg-blue-500/40 border border-blue-400/50 text-white",
      techBadge: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200",
      testimonial: "bg-blue-50 border-l-blue-400",
      testimonialText: "text-gray-700",
      testimonialAuthor: "text-gray-600",
      resultIcon: "text-blue-600",
      resultText: "text-gray-700",
      liveButton: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30",
      githubButton: "border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600",
    },
  },
  dark: {
    bg: {
      primary: "bg-black",
      secondary: "bg-gray-900",
      tertiary: "bg-slate-900",
      accent: "bg-slate-800/50",
    },
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      tertiary: "text-gray-400",
      accent: "text-teal-400",
    },
    card: {
      base: "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-yellow-500/20",
      hover: "hover:border-yellow-500/50 hover:shadow-yellow-500/20",
      interactive:
        "hover:shadow-xl hover:-translate-y-2 transition-all duration-300",
      padding: "p-8 rounded-2xl",
    },
    input: {
      base: "bg-slate-800 border border-slate-700 text-white placeholder-gray-500",
      focus: "focus:border-yellow-500 focus:ring-yellow-500/20",
    },
    button: {
      primary: "bg-yellow-500 hover:bg-yellow-600 text-black",
      secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    },
    badge: {
      primary: "bg-teal-500/40 text-teal-400",
      secondary: "bg-slate-700 text-slate-300",
    },
    divider: "border-gray-700",
    accent: {
      primary: "text-teal-400",
      secondary: "text-yellow-400",
      bg: "bg-teal-500/40",
    },
    portfolio: {
      accentLine: "bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600",
      card: "bg-slate-800/40 border border-teal-500/20 hover:border-teal-500/70 hover:shadow-2xl hover:shadow-teal-500/10",
      imageOverlay: "bg-gradient-to-t from-slate-900 via-transparent to-transparent group-hover:from-slate-900/70",
      categoryBadge: "bg-blue-500/40 border border-blue-400/50 text-blue-200",
      techBadge: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30",
      testimonial: "bg-slate-900/50 border-l-blue-500",
      testimonialText: "text-gray-300",
      testimonialAuthor: "text-gray-400",
      resultIcon: "text-blue-400",
      resultText: "text-gray-300",
      liveButton: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-900 shadow-lg shadow-teal-500/30 hover:shadow-yellow-500/50",
      githubButton: "border-teal-500 text-teal-400 hover:bg-teal-500/15 hover:border-teal-400",
    },
  },
};

/**
 * Get theme colors based on dark mode flag
 */
export const getThemeClass = (
  isDarkMode: boolean,
  lightClass: string,
  darkClass: string,
): string => {
  return isDarkMode ? darkClass : lightClass;
};

/**
 * Get theme colors based on dark mode flag
 */
export const getThemeColor = (isDarkMode: boolean) => {
  return isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;
};

/**
 * Get theme Tailwind classes based on dark mode flag
 */
export const getThemeTailwind = (isDarkMode: boolean) => {
  return isDarkMode ? THEME_TAILWIND.dark : THEME_TAILWIND.light;
};

/**
 * Icon color helpers
 */
export const ICON_COLORS = {
  light: {
    primary: "text-blue-600",
    accent: "text-blue-400",
    bg: "bg-blue-100",
  },
  dark: {
    primary: "text-teal-400",
    accent: "text-teal-300",
    bg: "bg-teal-500/40",
  },
};

/**
 * Section header classes
 */
export const getSectionHeaderClass = (isDarkMode: boolean) => {
  return {
    accentLine: isDarkMode
      ? "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600"
      : "bg-gradient-to-r from-blue-500 to-blue-400",
    title: isDarkMode ? "text-white" : "text-gray-900",
    description: isDarkMode ? "text-gray-400" : "text-gray-600",
  };
};
