export function getSectionPalette(isDarkMode: boolean) {
  const primaryAccent = isDarkMode ? "rgb(45, 212, 191)" : "#2563eb";
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
  };
}
