"use client";

import { useThemeContext } from "@/context/ThemeContext";

interface PersonalInfoData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export default function PersonalInfo({
  personalInfo,
}: {
  personalInfo: PersonalInfoData;
}) {
  const { isDarkMode } = useThemeContext();

  const ContactLink = ({
    icon,
    label,
    href,
    isEmail = false,
  }: {
    icon: React.ReactNode;
    label: string;
    href: string;
    isEmail?: boolean;
  }) => (
    <div className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 ${isDarkMode ? "text-yellow-500" : "text-blue-600"}`}
      >
        {icon}
      </div>
      <a
        href={isEmail ? `mailto:${href}` : `tel:${href}`}
        className={`font-semibold transition-colors hover:opacity-80 ${
          isDarkMode ? "text-yellow-500" : "text-blue-600"
        }`}
      >
        {label}
      </a>
    </div>
  );

  const SocialButton = ({
    icon,
    label,
    href,
  }: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border-2 transition-all ${
        isDarkMode
          ? "border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
          : "border-blue-600/50 text-blue-600 hover:bg-blue-600/10"
      }`}
    >
      {icon}
      {label}
    </a>
  );

  return (
    <div
      className={`section-card ${isDarkMode ? "section-card-dark" : "section-card-light"}`}
    >
      <div className="space-y-4 mb-6">
        <ContactLink
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
          label={personalInfo.email}
          href={personalInfo.email}
          isEmail={true}
        />

        <ContactLink
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.22.527.645 1.29 1.331 1.975.688.687 1.45 1.113 1.976 1.334l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          }
          label={personalInfo.phone}
          href={personalInfo.phone}
        />

        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 ${isDarkMode ? "text-yellow-500" : "text-blue-600"}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span
            className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
          >
            {personalInfo.location}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <SocialButton
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          }
          label="Website"
          href={personalInfo.website}
        />
        <SocialButton
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm6.5 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          }
          label="LinkedIn"
          href={personalInfo.linkedin}
        />
        <SocialButton
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          }
          label="GitHub"
          href={personalInfo.github}
        />
      </div>
    </div>
  );
}
