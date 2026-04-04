"use client";

import { Mail, Linkedin, Github, Globe, Download, Send } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";

interface PersonalInfo {
  name: string;
  title: string;
  photoUrl: string;
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export default function ProfileCard({
  personalInfo,
}: {
  personalInfo: PersonalInfo;
}) {
  const { isDarkMode } = useThemeContext();

  const socialLinks = [
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Globe, href: personalInfo.website, label: "Website" },
  ];

  return (
    <div
      className={`rounded-3xl p-8 md:p-16 mb-16 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50"
          : "bg-gradient-to-br from-white via-blue-50/30 to-white border border-gray-200/50"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left: Profile Image */}
        <div className="flex justify-center lg:col-span-1">
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-2xl blur-2xl opacity-50 ${
                isDarkMode ? "bg-blue-500/30" : "bg-blue-400/30"
              }`}
            />
            <div
              className={`relative w-40 h-40 rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 ${
                isDarkMode
                  ? "border-blue-500 shadow-2xl shadow-blue-500/30"
                  : "border-blue-400 shadow-2xl shadow-blue-400/30"
              }`}
            >
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Middle & Right: Info */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {/* Name & Title */}
          <div className="mb-8">
            <h1
              className={`text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {personalInfo.name}
            </h1>
            <p
              className={`text-xl font-semibold px-5 py-3 rounded-full inline-block ${
                isDarkMode
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {personalInfo.title}
            </p>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3
              className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              About Me
            </h3>
            <p
              className={`text-base leading-relaxed ${
                isDarkMode ? "text-slate-300" : "text-gray-700"
              }`}
            >
              {personalInfo.summary}
            </p>
          </div>

          {/* Social Links & Location */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Location */}
            {personalInfo.location && (
              <p
                className={`text-base font-medium ${
                  isDarkMode ? "text-slate-400" : "text-gray-700"
                }`}
              >
                📍 {personalInfo.location}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
              }`}
            >
              <Download className="w-5 h-5" />
              Download CV
            </button>
            <button
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border-2 ${
                isDarkMode
                  ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  : "border-blue-500 text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Send className="w-5 h-5" />
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
