"use client";

import React, { useState } from "react";
import {
  Menu,
  ShoppingCart,
  User,
  FileText,
  Briefcase,
  BookOpen,
  Mail,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";

const MENU_ITEMS = [
  { icon: Menu, label: "Menu", href: "#menu" },
  { icon: ShoppingCart, label: "Shop", href: "#shop" },
  { icon: User, label: "Profile", href: "#profile" },
  { icon: FileText, label: "Resume", href: "#resume" },
  { icon: Briefcase, label: "Works", href: "#works" },
  { icon: BookOpen, label: "Blog", href: "#blog" },
  { icon: Mail, label: "Contact", href: "#contact" },
  { icon: Package, label: "Products", href: "#products" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useThemeContext();

  return (
    <div
      className={`flex flex-col items-center justify-between py-8 px-4 h-screen transition-all duration-300 sticky top-0 ${
        isCollapsed ? "w-20" : "w-28"
      } ${isDarkMode ? "bg-slate-900 border-r border-slate-700" : "bg-white border-r border-gray-200"}`}
    >
      {/* Menu Items */}
      <div className="flex flex-col gap-6">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`p-3 rounded-lg transition-all duration-300 group relative ${
                isDarkMode
                  ? "hover:bg-blue-500/20 text-slate-400 hover:text-blue-400"
                  : "hover:bg-blue-100 text-gray-600 hover:text-blue-600"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="text-xs font-medium mt-1 block">
                  {item.label}
                </span>
              )}
              {isCollapsed && (
                <div
                  className={`absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-200"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {item.label}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isDarkMode
            ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400"
            : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
        }`}
        title="Toggle sidebar"
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
