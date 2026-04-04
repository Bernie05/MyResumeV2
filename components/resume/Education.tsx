"use client";

import { useThemeContext } from "@/context/ThemeContext";
import { useThemeClasses } from "@/theme/useThemeClasses";

interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

export default function Education({
  education,
}: {
  education: EducationItem[];
}) {
  const { isDarkMode } = useThemeContext();
  const { cx, sectionHeader, text, badge } = useThemeClasses();

  return (
    <div>
      {/* Section Header */}
      <div className="mb-10">
        <h2 className={`section-title ${sectionHeader.title}`}>Education</h2>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id}>
            <div
              className={cx(
                "relative p-8 rounded-2xl border-l-4 transition-all duration-300 hover:translate-x-2 hover:shadow-xl overflow-hidden bg-white border-l-blue-500 hover:border-l-blue-400 hover:shadow-blue-500/20",
                "relative p-8 rounded-2xl border-l-4 transition-all duration-300 hover:translate-x-2 hover:shadow-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-l-blue-500 hover:border-l-blue-400 hover:shadow-blue-500/20",
              )}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${text.primary}`}>
                    {edu.school}
                  </h3>
                  <p className={`text-lg font-semibold ${text.accent}`}>
                    {edu.degree} in {edu.field}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap ${badge.primary}`}
                >
                  {edu.year}
                </div>
              </div>

              <p className={`text-base ${text.secondary}`}>📍 {edu.location}</p>
            </div>

            {index !== education.length - 1 && (
              <div className={`my-4 border-t border-theme-primary`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
