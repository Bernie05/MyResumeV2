"use client";

import { Linkedin, Download, Facebook, Twitter, Instagram } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";

interface PersonalInfo {
  // Basic info
  name: string;
  title: string;
  photoUrl: string;
  backgroundUrl?: string;
  email?: string;
  location?: string;

  // Social media links
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

interface HeroStats {
  yearsExperience?: number;
  projects?: number;
  clients?: number;
  awards?: number;
}

export default function HeroSection({
  personalInfo,
  stats,
}: {
  personalInfo: PersonalInfo;
  stats?: HeroStats;
}) {
  const { isDarkMode } = useThemeContext();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <div className="relative w-full">
      {/* Hero Background Container */}
      <div
        className="relative w-full h-screen md:h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('${personalInfo.backgroundUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-r from-black/80 via-black/60 to-transparent"
              : "bg-gradient-to-r from-black/60 via-black/40 to-transparent"
          }`}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 w-full h-full">
          {/* Circular Profile Photo */}
          <div className="mb-8 relative">
            <div
              className={`absolute -inset-8 rounded-full blur-3xl opacity-40 ${
                isDarkMode ? "bg-teal-500/40" : "to-blue-600"
              }`}
            />
            <div
              className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 transition-transform hover:scale-110 ${
                isDarkMode
                  ? "border-teal-400/80 shadow-2xl shadow-teal-500/30"
                  : "border-blue-600/80 shadow-2xl shadow-blue-400/40"
              }`}
            >
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
            {personalInfo.name}
          </h1>

          {/* Professional Title */}
          <p className="text-sm md:text-base lg:text-lg font-semibold text-white/90 mb-8 tracking-widest uppercase">
            {personalInfo.title}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <button
              className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? "bg-teal-500 hover:bg-teal-400 text-black shadow-lg shadow-teal-500/40"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40"
              }`}
            >
              Hire Me
            </button>

            <button
              className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 border-2 hover:scale-105 active:scale-95 border-white text-white hover:bg-white/10}`}
            >
              <Download className="w-4 h-4" />
              Download CV
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 justify-center">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-teal-500/40"
                    : "bg-white/20 text-white hover:bg-white/40 backdrop-blur"
                }`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section - Optional */}
      {stats && (
        <div
          className={`w-full px-4 sm:px-6 lg:px-8 py-16 ${
            isDarkMode ? "bg-gray-950" : "bg-gray-50"
          }`}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.yearsExperience && stats.yearsExperience !== 0 && (
              <div className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? "text-teal-400" : "text-blue-600"
                  }`}
                >
                  {stats.yearsExperience}+
                </div>
                <p
                  className={`text-sm md:text-base font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Years Experience
                </p>
              </div>
            )}

            {stats.projects && stats.projects !== 0 && (
              <div className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? "text-teal-400" : "text-blue-600"
                  }`}
                >
                  {stats.projects}
                </div>
                <p
                  className={`text-sm md:text-base font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Completed Projects
                </p>
              </div>
            )}

            {stats.clients && stats.clients !== 0 && (
              <div className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? "text-teal-400" : "text-blue-600"
                  }`}
                >
                  {stats.clients}
                </div>
                <p
                  className={`text-sm md:text-base font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Happy Clients
                </p>
              </div>
            )}

            {stats.awards && stats.awards !== 0 && (
              <div className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? "text-teal-400" : "text-blue-600"
                  }`}
                >
                  {stats.awards}+
                </div>
                <p
                  className={`text-sm md:text-base font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Honors and Awards
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
