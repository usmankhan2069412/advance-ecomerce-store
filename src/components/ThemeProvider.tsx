"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeColor = "default" | "warm" | "cool" | "vibrant";

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeColor, setThemeColorState] = useState<ThemeColor>("default");
  const [mounted, setMounted] = useState(false);

  // Set theme based on user preference
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedThemeColor = localStorage.getItem("themeColor") as ThemeColor | null;
    
    // Check for system preference if no saved theme
    if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "dark") {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    }
    
    // Set theme color if saved
    if (savedThemeColor) {
      setThemeColorState(savedThemeColor);
      document.documentElement.setAttribute("data-theme-color", savedThemeColor);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setThemeColor = (color: ThemeColor) => {
    localStorage.setItem("themeColor", color);
    setThemeColorState(color);
    document.documentElement.setAttribute("data-theme-color", color);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeColor, setTheme, setThemeColor, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 