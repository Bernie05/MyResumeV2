"use client";

import { useThemeContext } from "@/context/ThemeContext";

interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

export default function Certifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  const { isDarkMode } = useThemeContext();

  return (
    <div>
      {/* Section Header */}
      <div className="mb-10">
        <h2
          className={`text-3xl md:text-4xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className={`relative p-8 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border-l-emerald-500 hover:border-l-emerald-400 hover:shadow-emerald-500/20"
                : "bg-white border-l-blue-500 hover:border-l-blue-400 hover:shadow-blue-500/20"
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-4xl">🏆</div>
              <div className="flex-grow">
                <p
                  className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {cert.name}
                </p>
                <p
                  className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {cert.issuer}
                </p>
                <p
                  className={`text-sm font-semibold mt-2 px-3 py-1 rounded-lg inline-block ${
                    isDarkMode
                      ? "bg-teal-500/40 text-teal-400"
                      : "bg-blue-500 text-blue-700"
                  }`}
                >
                  {cert.year}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
