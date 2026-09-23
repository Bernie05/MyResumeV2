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

// Create a context for theme management, providing the current theme mode, a toggle function, and the MUI theme object.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a MUI theme based on the current mode (dark or light)
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

// Default context value to avoid undefined checks in consumers
const DEFAULT_THEME_CONTEXT: ThemeContextType = {
  isDarkMode: true,
  toggleTheme: () => {},
  theme: createAppTheme(true),
};

// ThemeContextProvider component that wraps the app and provides theme state and toggle functionality
export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load the theme preference from localStorage on mount and set the initial theme state
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-mode");

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Update the HTML data attribute for color mode whenever the theme changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute(
        "data-color-mode",
        isDarkMode ? "dark" : "light",
      );
    }
  }, [isDarkMode]);

  // Toggle the theme mode and persist the preference in localStorage
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme-mode", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Memoize the theme object to avoid unnecessary re-renders of the ThemeProvider
  const theme = useMemo(() => createAppTheme(isDarkMode), [isDarkMode]);

  if (!mounted) {
    return <>{children}</>;
  }

  // Provide the theme context and wrap children with MUI ThemeProvider
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to access the ThemeContext, providing theme state and toggle functionality
export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    return DEFAULT_THEME_CONTEXT;
  }
  return context;
};
