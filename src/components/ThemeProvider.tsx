"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "default" | "warm" | "cool" | "vibrant";

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
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
  const [themeColor, setThemeColorState] = useState<ThemeColor>("default");
  const [mounted, setMounted] = useState(false);

  // Set theme color based on user preference
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme color preference
    const savedThemeColor = localStorage.getItem("themeColor") as ThemeColor | null;
    
    // Set theme color if saved
    if (savedThemeColor) {
      setThemeColorState(savedThemeColor);
      document.documentElement.setAttribute("data-theme-color", savedThemeColor);
    }
  }, []);

  const setThemeColor = (color: ThemeColor) => {
    localStorage.setItem("themeColor", color);
    setThemeColorState(color);
    document.documentElement.setAttribute("data-theme-color", color);
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};