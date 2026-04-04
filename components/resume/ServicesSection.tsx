"use client";

import {
  Code2,
  Palette,
  Zap,
  Users,
  Smartphone,
  Database,
  GitBranch,
  Briefcase,
} from "lucide-react";
import { useThemeClasses } from "@/theme/useThemeClasses";

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

const SKILL_ICONS: Record<string, any> = {
  react: Code2,
  typescript: Code2,
  nodejs: Briefcase,
  frontend: Palette,
  backend: Database,
  performance: Zap,
  leadership: Users,
  mobile: Smartphone,
  git: GitBranch,
  default: Code2,
};

function getIconForSkill(skillName: string): any {
  const name = skillName.toLowerCase();
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return SKILL_ICONS.default;
}

export default function ServicesSection({
  skills,
}: {
  skills: SkillCategory[];
}) {
  const { card, text, badge, sectionHeader, iconColor } = useThemeClasses();

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="mb-10">
        <h2 className={`section-title ${sectionHeader.title}`}>What I Offer</h2>
        <p className={`section-subtitle ${sectionHeader.description}`}>
          Professional services tailored to your project needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.slice(0, 2).map((category) => (
          <div
            key={category.category}
            className={`${card.base} ${card.padding} ${card.interactive}`}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`icon-wrapper ${iconColor.bg}`}>
                <Code2 className={`w-7 h-7 ${iconColor.primary}`} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${text.primary}`}>
                  {category.category} Development
                </h3>
                <p className={`text-sm mt-1 ${text.tertiary}`}>
                  Expert {category.category.toLowerCase()} solutions
                </p>
              </div>
            </div>

            {/* Skills list */}
            <div className="space-y-3">
              {category.items.slice(0, 4).map((skill) => {
                const IconComponent = getIconForSkill(skill.name);
                return (
                  <div key={skill.name} className="flex items-center gap-3">
                    <IconComponent
                      className={`w-5 h-5 flex-shrink-0 ${iconColor.primary}`}
                    />
                    <span className={`text-base font-medium ${text.secondary}`}>
                      {skill.name}
                    </span>
                    <div
                      className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${badge.primary}`}
                    >
                      {Math.round(skill.proficiency / 20) * 20}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
