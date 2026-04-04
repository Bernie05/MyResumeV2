"use client";

import { Sun, Moon, Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { useThemeClasses } from "@/theme/useThemeClasses";
import { resumeData } from "@/data/resume";

interface PersonalInfo {
  name: string;
  title: string;
  photoUrl: string;
  backgroundUrl: string;
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export default function Header() {
  const personalInfo = resumeData.personalInfo as PersonalInfo;
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { cx, bg } = useThemeClasses();

  const socialLinks = [
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Globe, href: personalInfo.website, label: "Website" },
  ];

  const themeStyles = {
    toggleBtn: cx(
      "bg-slate-900/60 border-blue-400/30 hover:bg-slate-900/80 text-blue-300",
      "bg-slate-900/60 border-yellow-500/30 hover:bg-slate-900/80 text-yellow-400",
    ),
    photoBorder: cx(
      "border-white shadow-2xl shadow-blue-500/40",
      "border-yellow-400 shadow-2xl shadow-yellow-500/40",
    ),
    photoBg: cx("bg-blue-500/30", "bg-yellow-500/30"),
    titleBox: cx(
      "bg-blue-500/15 border-blue-300/40 text-blue-100",
      "bg-yellow-500/15 border-yellow-400/40 text-yellow-100",
    ),
    socialLink: cx(
      "bg-blue-500/15 border-blue-300/40 text-blue-300 hover:bg-blue-500/25 hover:border-blue-300/60",
      "bg-yellow-500/15 border-yellow-400/40 text-yellow-300 hover:bg-yellow-500/25 hover:border-yellow-400/60",
    ),
    ctaBtn: cx(
      "bg-blue-500 border-blue-600 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/40",
      "bg-yellow-500 border-yellow-600 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/40",
    ),
    divider: isDarkMode ? "fill-slate-900" : "fill-white",
  };

  return (
    <div className="relative w-full overflow-hidden mb-12">
      {/* Hero Section with gradient overlay */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('${personalInfo.backgroundUrl}')`,
            backgroundPosition: "center",
          }}
        />

        {/* Advanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Theme Toggle Button - Premium Style */}
        <button
          onClick={toggleTheme}
          className={`absolute top-8 right-8 z-20 p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-95 ${themeStyles.toggleBtn}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Profile Photo with Enhanced Styling */}
          <div className="mb-8 relative">
            <div
              className={`absolute inset-0 rounded-full blur-2xl opacity-75 animate-pulse ${themeStyles.photoBg}`}
              style={{ padding: "4px" }}
            />
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.name}
              className={`relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 transition-all duration-500 hover:scale-105 ${themeStyles.photoBorder}`}
            />
          </div>

          {/* Name - Premium Typography */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center text-white drop-shadow-xl tracking-tight">
            {personalInfo.name}
          </h1>

          {/* Title/Role - Accent Style */}
          <div
            className={`px-6 py-2 rounded-full backdrop-blur-sm border mb-8 transition-all ${themeStyles.titleBox}`}
          >
            <p className="text-lg md:text-xl font-semibold">
              {personalInfo.title}
            </p>
          </div>

          {/* Location */}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-white/80 mb-8 text-sm md:text-base">
              <MapPin className="w-5 h-5" />
              <span>{personalInfo.location}</span>
            </div>
          )}

          {/* Social Links */}
          <div className="flex gap-4 mb-8">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-95 ${themeStyles.socialLink}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${themeStyles.ctaBtn}`}
          >
            View Full Resume
          </button>
        </div>
      </div>

      {/* Curved Bottom Divider */}
      <div className="relative h-16 -mt-1">
        <svg
          className={`w-full h-full ${themeStyles.divider}`}
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>
    </div>
  );
}
