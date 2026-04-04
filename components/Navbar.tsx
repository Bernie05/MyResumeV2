"use client";

import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useThemeClasses } from "@/theme/useThemeClasses";
import { Menu, X, Moon, Sun } from "lucide-react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { cx, text, bg, button } = useThemeClasses();

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${cx(
        "bg-white border-b border-gray-200 shadow-sm",
        "bg-black/95 border-b border-gray-800",
      )}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a
              href="#"
              className={`text-xl font-bold tracking-wider ${text.primary}`}
            >
              CREATIVE CV
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors hover:text-teal-500 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${cx(
                "bg-gray-100 hover:bg-gray-200 text-gray-900",
                "bg-gray-900 hover:bg-gray-800 text-teal-400",
              )}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${cx(
                "hover:bg-gray-200 text-gray-900",
                "hover:bg-gray-900 text-white",
              )}`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${bg.secondary}`}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors hover:text-teal-500 ${isDarkMode ? "text-gray-200 hover:bg-gray-900" : "text-gray-900 hover:bg-gray-100"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
