"use client";

import { ExternalLink, Github } from "lucide-react";
import { useThemeClasses } from "@/theme/useThemeClasses";

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
  demoUrl?: string;
  caseStudy?: string;
}

export default function Projects({ projects }: { projects: Project[] }) {
  const { sectionHeader, text, cx } = useThemeClasses();

  return (
    <div>
      {/* Section Header */}
      <div className="mb-14">
        <h2 className={`section-title ${sectionHeader.title}`}>
          Recent Projects
        </h2>
        <p className={`mt-3 text-lg ${text.secondary}`}>
          Latest work and technical achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col ${cx(
              "bg-white border border-gray-100 shadow-lg hover:shadow-2xl",
              "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 shadow-xl hover:shadow-2xl hover:border-blue-500/30",
            )}`}
          >
            {/* Image */}
            {project.image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 ${cx(
                    "bg-gradient-to-t from-black/40 via-transparent to-transparent",
                    "bg-gradient-to-t from-slate-900/70 via-transparent to-transparent",
                  )}`}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
              <h3 className={`text-xl font-bold mb-3 ${text.primary}`}>
                {project.name}
              </h3>
              <p
                className={`text-sm mb-5 flex-grow leading-relaxed ${text.secondary}`}
              >
                {project.caseStudy || project.description}
              </p>

              {/* Technologies */}
              <div className="mb-6">
                <p
                  className={`text-xs font-semibold mb-3 uppercase tracking-wider ${text.tertiary}`}
                >
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${cx(
                        "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
                        "bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30",
                      )}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex-1 ${cx(
                      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30",
                      "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-900 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50",
                    )}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </a>
                )}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border-2 flex-1 ${cx(
                    "border-blue-500 text-blue-600 hover:bg-blue-50",
                    "border-teal-500 text-teal-400 hover:bg-teal-500/15 hover:border-teal-400",
                  )}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
