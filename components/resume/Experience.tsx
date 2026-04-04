"use client";

import { useThemeClasses } from "@/theme/useThemeClasses";

interface Job {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
}

export default function Experience({ experience }: { experience: Job[] }) {
  const { sectionHeader, text, cx, badge, divider } = useThemeClasses();

  return (
    <div>
      {/* Section Header */}
      <div className="mb-10">
        <h2 className={`section-title ${sectionHeader.title}`}>
          Professional Experience
        </h2>
      </div>

      <div className="space-y-8">
        {experience.map((job, index) => (
          <div key={job.id}>
            <div
              className={cx(
                "relative p-8 rounded-2xl border-l-4 transition-all duration-300 hover:translate-x-2 hover:shadow-xl overflow-hidden bg-white border-l-blue-500 hover:border-l-blue-400 hover:shadow-blue-500/20",
                "relative p-8 rounded-2xl border-l-4 transition-all duration-300 hover:translate-x-2 hover:shadow-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-l-blue-500 hover:border-l-blue-400 hover:shadow-blue-500/20",
              )}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${text.primary}`}>
                    {job.position}
                  </h3>
                  <p className={`text-lg font-semibold ${text.accent}`}>
                    {job.company}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap ${badge.primary}`}
                >
                  {job.duration}
                </div>
              </div>

              <p className={`text-base mb-5 ${text.secondary}`}>
                📍 {job.location}
              </p>

              <ul className="space-y-3">
                {job.description.map((desc, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2.5 ${text.accent}`}
                    />
                    <span
                      className={`text-base leading-relaxed ${text.secondary}`}
                    >
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {index !== experience.length - 1 && (
              <div className={`my-6 border-t ${divider}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
