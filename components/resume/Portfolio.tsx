"use client";

import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { useThemeClasses } from "@/theme/useThemeClasses";
import { useState } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  results: string[];
  testimonial: string;
  client: string;
}

export default function Portfolio({
  portfolio,
}: {
  portfolio: PortfolioItem[];
}) {
  const {
    sectionHeader,
    text,
    portfolio: portfolioTheme,
    cx,
  } = useThemeClasses();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div>
      {/* Section Header */}
      <div className="mb-16">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${text.primary}`}
        >
          Featured Work
        </h2>
        <p className={`text-lg max-w-2xl ${text.secondary}`}>
          Explore my best projects and case studies. Each project showcases
          strategic problem-solving and technical excellence.
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className={`group h-full rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${portfolioTheme.card}`}
          >
            <div className="flex flex-col gap-0 h-full">
              {/* Image */}
              <div className="relative h-64 lg:h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${portfolioTheme.imageOverlay}`}
                />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md ${portfolioTheme.categoryBadge}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    className={`text-2xl md:text-3xl font-bold mb-4 tracking-tight ${text.primary}`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base mb-6 leading-relaxed transition-all duration-300 ${
                      selectedId === item.id
                        ? "line-clamp-none"
                        : "line-clamp-2"
                    } ${text.secondary}`}
                  >
                    {item.longDescription}
                  </p>

                  {/* Technologies */}
                  <div className="mb-6">
                    <p
                      className={`text-sm font-semibold mb-3 ${text.tertiary}`}
                    >
                      TECH STACK
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${portfolioTheme.techBadge}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <p
                      className={`text-sm font-semibold mb-3 ${text.tertiary}`}
                    >
                      KEY RESULTS
                    </p>
                    <ul className="space-y-2">
                      {item.results.map((result, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-sm"
                        >
                          <ChevronRight
                            className={`w-4 h-4 flex-shrink-0 ${portfolioTheme.resultIcon}`}
                          />
                          <span className={portfolioTheme.resultText}>
                            {result}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Client Testimonial */}
                <div
                  className={`p-4 rounded-lg mb-6 border-l-4 ${portfolioTheme.testimonial}`}
                >
                  <p
                    className={`text-sm italic mb-2 ${portfolioTheme.testimonialText}`}
                  >
                    "{item.testimonial}"
                  </p>
                  <p
                    className={`text-xs font-semibold ${portfolioTheme.testimonialAuthor}`}
                  >
                    — {item.client}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap pt-2">
                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${portfolioTheme.liveButton}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border-2 ${portfolioTheme.githubButton}`}
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
