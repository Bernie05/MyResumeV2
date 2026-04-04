"use client";

import { useThemeContext } from "@/context/ThemeContext";

export default function Summary({ summary }: { summary: string }) {
  const { isDarkMode } = useThemeContext();

  return (
    <div
      className={`section-card ${isDarkMode ? "section-card-dark" : "section-card-light"}`}
    >
      <h2
        className={`section-title ${isDarkMode ? "section-title-dark" : "section-title-light"}`}
      >
        Professional Summary
      </h2>
      <p
        className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
      >
        {summary}
      </p>
    </div>
  );
}
