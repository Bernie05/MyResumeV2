"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  createTheme,
  type Theme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "rgb(45, 212, 191)" : "#1976d2",
      },
      secondary: {
        main: isDarkMode ? "rgb(45, 212, 191)" : "#1976d2",
      },
      background: {
        default: isDarkMode ? "#0f1419" : "#f5f5f5",
        paper: isDarkMode ? "#1a1f2e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#d4d4d4" : "rgba(255, 255, 255, 0.9)",
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

const DEFAULT_THEME_CONTEXT: ThemeContextType = {
  isDarkMode: true,
  toggleTheme: () => {},
  theme: createAppTheme(true),
};

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

  const theme = useMemo(() => createAppTheme(isDarkMode), [isDarkMode]);

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
  console.log("useThemeContext: ", context);
  if (context === undefined) {
    return DEFAULT_THEME_CONTEXT;
  }
  return context;
};
