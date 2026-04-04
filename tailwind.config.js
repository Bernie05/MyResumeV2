/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#0066cc",
          dark: "#00cc99",
        },
        secondary: {
          light: "#0052a3",
          dark: "#00aa88",
        },
        accent: {
          gold: "#00cc99",
          "gold-light": "#00dd99",
          "gold-dark": "#00bb88",
        },
        bg: {
          light: "#ffffff",
          "light-secondary": "#ffffff",
          dark: "#000000",
          "dark-secondary": "#111111",
          "dark-tertiary": "#0a0a0a",
        },
        text: {
          light: "#1a1a1a",
          "light-secondary": "#404040",
          dark: "#ffffff",
          "dark-secondary": "#e0e0e0",
        },
      },
      backgroundImage: {
        "dark-gradient":
          "linear-gradient(135deg, rgb(0, 0, 0) 0%, rgb(17, 17, 17) 50%, rgb(10, 10, 10) 100%)",
        "light-gradient":
          "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 100%)",
        "hero-dark":
          "linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(17, 17, 17, 0.8) 100%)",
      },
    },
  },
  plugins: [],
};
