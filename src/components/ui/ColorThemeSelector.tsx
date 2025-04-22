"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorTheme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const themes: ColorTheme[] = [
  {
    name: "Default",
    primary: "#2D2D2D",
    secondary: "#F8F4E3",
    accent: "#D4AF37",
  },
  {
    name: "Ocean",
    primary: "#1A2E35",
    secondary: "#F0F7F4",
    accent: "#3498DB",
  },
  { name: "Rose", primary: "#2D232E", secondary: "#F9F1F0", accent: "#D64161" },
  {
    name: "Forest",
    primary: "#1E3329",
    secondary: "#F4F9F4",
    accent: "#4CAF50",
  },
];

interface ColorThemeSelectorProps {
  onThemeChange?: (theme: ColorTheme) => void;
  className?: string;
}

export function ColorThemeSelector({
  onThemeChange,
  className,
}: ColorThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(themes[0]);

  const handleThemeChange = (theme: ColorTheme) => {
    setSelectedTheme(theme);

    // Apply theme to CSS variables
    document.documentElement.style.setProperty(
      "--color-primary",
      theme.primary,
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      theme.secondary,
    );
    document.documentElement.style.setProperty(
      "--color-accent-gold",
      theme.accent,
    );

    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Color Theme</h3>
      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => handleThemeChange(theme)}
            className={cn(
              "relative flex flex-col items-center p-2 rounded-md border transition-all",
              selectedTheme.name === theme.name
                ? "border-accent-gold ring-2 ring-accent-gold ring-opacity-50"
                : "border-gray-200 hover:border-accent-gold",
            )}
            aria-label={`Select ${theme.name} theme`}
          >
            <div className="flex space-x-1 mb-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: theme.secondary }}
              />
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
            <span className="text-xs font-medium">{theme.name}</span>

            {selectedTheme.name === theme.name && (
              <div className="absolute -top-2 -right-2 bg-accent-gold text-white p-1 rounded-full">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
