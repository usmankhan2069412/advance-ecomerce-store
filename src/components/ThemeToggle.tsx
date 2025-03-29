"use client";

import { useTheme } from "./ThemeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-gray-600 transition-transform duration-300 rotate-0" />
      ) : (
        <SunIcon className="h-5 w-5 text-gray-300 transition-transform duration-300 rotate-180" />
      )}
    </button>
  );
};