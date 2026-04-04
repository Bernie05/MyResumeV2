"use client";

import { useThemeClasses } from "@/theme/useThemeClasses";
import { Zap, TrendingUp, Award } from "lucide-react";

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  const { sectionHeader, text, cx } = useThemeClasses();

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return "Expert";
    if (proficiency >= 80) return "Advanced";
    if (proficiency >= 70) return "Proficient";
    return "Intermediate";
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "from-red-500 to-rose-500";
    if (proficiency >= 80) return "from-orange-500 to-amber-500";
    if (proficiency >= 70) return "from-yellow-500 to-amber-400";
    return "from-blue-500 to-cyan-500";
  };

  const getThemeCardColors = () => {
    return cx(
      // Light mode: White background (matching Education card)
      "bg-white border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-gray-500/10",
      // Dark mode: Slate gradient (matching Education card)
      "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-slate-500/20",
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <Zap className="w-6 h-6 text-blue-500" />;
      case "Backend":
        return <TrendingUp className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6 text-teal-500" />;
    }
  };

  const getCategoryAccentColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "blue";
      case "Backend":
        return "purple";
      default:
        return "teal";
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-16">
        <h2 className={`section-title ${sectionHeader.title}`}>
          Professional Skills
        </h2>
        <p className={`mt-3 text-lg ${text.secondary}`}>
          Expertise across technologies and platforms
        </p>
      </div>

      <div className="space-y-20">
        {skills.map((skillGroup, groupIndex) => {
          const categoryColor = getCategoryAccentColor(skillGroup.category);
          const colorMap: { [key: string]: string } = {
            blue: "from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-600",
            purple:
              "from-purple-500 to-purple-300 dark:from-purple-400 dark:to-purple-600",
            teal: "from-teal-500 to-teal-300 dark:from-teal-400 dark:to-teal-600",
          };
          const textColorMap: { [key: string]: string } = {
            blue: "text-blue-600 dark:text-blue-400",
            purple: "text-purple-600 dark:text-purple-400",
            teal: "text-teal-600 dark:text-teal-400",
          };

          return (
            <div key={groupIndex}>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                {getCategoryIcon(skillGroup.category)}
                <h3
                  className={`text-2xl md:text-3xl font-bold ${textColorMap[categoryColor]}`}
                >
                  {skillGroup.category} Development
                </h3>
                <div
                  className={`flex-grow h-1 rounded-full bg-gradient-to-r ${colorMap[categoryColor]}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillGroup.items.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${getThemeCardColors()} hover:-translate-y-1 hover:scale-105`}
                  >
                    <div className="flex items-center gap-6 p-6 h-full">
                      {/* Left Side: Circular Progress Indicator */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24">
                          <svg
                            className="transform -rotate-90 w-full h-full"
                            viewBox="0 0 100 100"
                          >
                            {/* Background Circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className={`text-white`}
                            />
                            {/* Progress Circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeDasharray={`${(skill.proficiency / 100) * 282.7} 282.7`}
                              strokeLinecap="round"
                              className={`transition-all duration-1000 ease-out ${text.accent}`}
                              style={{
                                animation: `strokeExpand 0.8s ease-out`,
                              }}
                            />
                            <defs></defs>
                          </svg>
                          {/* Center Percentage */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div
                                className={`text-xl font-black ${text.accent}`}
                              >
                                {skill.proficiency}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Text Content */}
                      <div className="flex-1 min-w-0">
                        {/* Skill Name */}
                        <h4
                          className={`text-base font-bold mb-2 ${text.primary} truncate`}
                        >
                          {skill.name}
                        </h4>

                        {/* Proficiency Label & Badge */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full transition-all ${cx(
                              "bg-blue-200 text-blue-800",
                              "bg-teal-500/40 text-teal-200",
                            )}`}
                          >
                            {getProficiencyLabel(skill.proficiency)}
                          </span>
                          {skill.proficiency >= 90 && (
                            <span
                              className={`inline-flex items-center px-2 py-1 text-white text-xs font-bold rounded-full transition-all ${cx(
                                "bg-gradient-to-r from-blue-500 to-blue-600",
                                "bg-gradient-to-r from-teal-500 to-teal-600",
                              )}`}
                            >
                              <Award className="w-3 h-3 mr-1" />
                              Expert
                            </span>
                          )}
                        </div>

                        {/* Skill Level Dots */}
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i < Math.ceil((skill.proficiency / 100) * 5)
                                  ? `bg-gradient-to-r ${getProficiencyColor(
                                      skill.proficiency,
                                    )}`
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes expandWidth {
          from {
            width: 0 !important;
          }
        }

        @keyframes strokeExpand {
          from {
            stroke-dasharray: 0 282.7 !important;
          }
        }
      `}</style>
    </div>
  );
}
