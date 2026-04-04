"use client";

import { resumeData } from "@/data/resume";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/resume/HeroSection";
import ServicesSection from "@/components/resume/ServicesSection";
import Experience from "@/components/resume/Experience";
import Education from "@/components/resume/Education";
import Skills from "@/components/resume/Skills";
import Portfolio from "@/components/resume/Portfolio";
import Projects from "@/components/resume/Projects";
import Certifications from "@/components/resume/Certifications";

import { useThemeClasses } from "@/theme/useThemeClasses";
import { useThemeContext } from "@/context/ThemeContext";
import { getThemeColor } from "@/theme/constants";

// add here the dark mode toggle and theme context provider if needed

export default function Home() {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { cx, text, bg, button } = useThemeClasses();
  const mode = getThemeColor(isDarkMode);
  console.log();

  return (
    <main className="w-full min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section / About */}
      <section id="about">
        <HeroSection
          personalInfo={resumeData.personalInfo}
          stats={resumeData.stats}
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-20 md:space-y-28">
          <ServicesSection skills={resumeData.skills} />
          <section id="experience">
            <Experience experience={resumeData.experience} />
          </section>
          <section id="portfolio">
            <Portfolio portfolio={resumeData.portfolio} />
          </section>
          <Projects projects={resumeData.projects} />
          <Education education={resumeData.education} />
          <section id="skills">
            <Skills skills={resumeData.skills} />
          </section>
          <Certifications certifications={resumeData.certifications} />

          {/* Footer / Contact */}
          <footer
            id="contact"
            className="text-center py-16 border-t border-gray-300 dark:border-gray-700 mt-20"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              ${new Date().getFullYear()} &copy; {resumeData.personalInfo.name}.
              All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
