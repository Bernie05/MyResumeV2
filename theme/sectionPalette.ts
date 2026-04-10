export interface ISectionPalette {
  primaryAccent: string;
  secondaryAccent: string;
  accentGlow: string;
  accentText: string;
  titleColor: string;
  bodyColor: string;
  mutedColor: string;
  sectionBackground: string;
  surfaceBackground: string;
  softBackground: string;
  softerBackground: string;
  outline: string;
  divider: string;
  buttonGradient: string;
  buttonHoverGradient: string;
  hoverShadow: string;
  navbarBackgroundColor: string;
  navbarBorderColor: string;
  navbarTextColor: string;
  navbarTextHoverColor: string;
  navbarTextHoverBackground: string;
  navbarIconButtonHoverBackground: string;
  navbarIconButtonBackgroundColor: string;
}

export interface IThemePalette {
  theme: ISectionPalette;
  isDarkMode: boolean;
}

export const getSectionPalette = (isDarkMode: boolean): ISectionPalette => {
  const primaryAccent = isDarkMode ? "rgb(20, 184, 166)" : "#1d4ed8";
  const secondaryAccent = isDarkMode ? "rgb(20, 184, 166)" : "#1d4ed8";
  const accentGlow = isDarkMode
    ? "rgba(45, 212, 191, 0.35)"
    : "rgba(37, 99, 235, 0.24)";

  return {
    primaryAccent,
    secondaryAccent,
    accentGlow,
    accentText: isDarkMode ? "#042f2e" : "#ffffff",
    titleColor: isDarkMode ? "#f8fafc" : "#0f172a",
    bodyColor: isDarkMode ? "#dbeafe" : "#334155",
    mutedColor: isDarkMode ? "#94a3b8" : "#64748b",
    sectionBackground: isDarkMode
      ? "rgba(2, 6, 23, 0.94)"
      : "linear-gradient(180deg, rgba(239, 246, 255, 0.9) 0%, rgba(255, 255, 255, 0.98) 100%)",
    surfaceBackground: isDarkMode
      ? "rgba(15, 23, 42, 0.96)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.99) 0%, rgba(239, 246, 255, 0.94) 100%)",
    softBackground: isDarkMode
      ? "rgba(45, 212, 191, 0.18)"
      : "rgba(37, 99, 235, 0.12)",
    softerBackground: isDarkMode
      ? "rgba(45, 212, 191, 0.1)"
      : "rgba(37, 99, 235, 0.06)",
    outline: isDarkMode
      ? "rgba(45, 212, 191, 0.22)"
      : "rgba(37, 99, 235, 0.14)",
    divider: isDarkMode
      ? "rgba(148, 163, 184, 0.18)"
      : "rgba(148, 163, 184, 0.24)",
    buttonGradient: isDarkMode
      ? primaryAccent
      : `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
    buttonHoverGradient: isDarkMode
      ? secondaryAccent
      : `linear-gradient(135deg, ${secondaryAccent}, ${primaryAccent})`,
    hoverShadow: isDarkMode
      ? `0 22px 40px ${accentGlow}`
      : "0 22px 40px rgba(37, 99, 235, 0.18)",
    navbarBackgroundColor: isDarkMode
      ? "rgba(2, 6, 23, 0.92)"
      : "rgba(255, 255, 255, 0.9)",
    navbarBorderColor: isDarkMode
      ? "rgba(51, 65, 85, 0.9)"
      : "rgba(226, 232, 240, 1)",
    navbarTextColor: isDarkMode ? "#e2e8f0" : "#0f172a", //
    navbarTextHoverColor: isDarkMode ? "rgb(45, 212, 191)" : "#1d4ed8",
    navbarTextHoverBackground: isDarkMode ? "#1d4ed8" : "#0f766e",
    navbarIconButtonBackgroundColor: isDarkMode
      ? "rgba(15, 23, 42, 0.95)"
      : "rgba(241, 245, 249, 1)",
    navbarIconButtonHoverBackground: isDarkMode
      ? "rgba(30, 41, 59, 1)"
      : "rgba(226, 232, 240, 1)",
  };
};
