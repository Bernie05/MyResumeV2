"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-mode");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute(
        "data-color-mode",
        isDarkMode ? "dark" : "light",
      );
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme-mode", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#ffd700" : "#1976d2",
      },
      secondary: {
        main: isDarkMode ? "#ffb700" : "#1565c0",
      },
      background: {
        default: isDarkMode ? "#0f1419" : "#f5f5f5",
        paper: isDarkMode ? "#1a1f2e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#e0e0e0" : "#1a1a1a",
        secondary: isDarkMode ? "#b0b0b0" : "#666666",
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: "0.5px",
      },
      h2: {
        fontWeight: 800,
        letterSpacing: "0.5px",
      },
    },
  });

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default theme context during SSR/build time
    return {
      isDarkMode: true,
      toggleTheme: () => {},
      theme: createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#ffd700" },
          secondary: { main: "#ffb700" },
          background: { default: "#0f1419", paper: "#1a1f2e" },
          text: { primary: "#e0e0e0", secondary: "#b0b0b0" },
        },
      }),
    };
  }
  return context;
};
