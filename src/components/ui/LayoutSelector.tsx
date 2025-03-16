"use client";

import { useState } from "react";
import { LayoutGrid, LayoutList, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutType = "grid" | "list";

interface LayoutSelectorProps {
  onLayoutChange?: (layout: LayoutType) => void;
  className?: string;
}

export function LayoutSelector({
  onLayoutChange,
  className,
}: LayoutSelectorProps) {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("grid");

  const handleLayoutChange = (layout: LayoutType) => {
    setSelectedLayout(layout);
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  };

  return (
    <div className={cn("flex border rounded-md overflow-hidden", className)}>
      <button
        onClick={() => handleLayoutChange("grid")}
        className={cn(
          "flex items-center justify-center p-2 transition-colors",
          selectedLayout === "grid"
            ? "bg-primary text-secondary"
            : "bg-white dark:bg-gray-800 text-primary dark:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700",
        )}
        aria-label="Grid layout"
        aria-pressed={selectedLayout === "grid"}
      >
        <LayoutGrid className="h-5 w-5" />
      </button>

      <button
        onClick={() => handleLayoutChange("list")}
        className={cn(
          "flex items-center justify-center p-2 transition-colors",
          selectedLayout === "list"
            ? "bg-primary text-secondary"
            : "bg-white dark:bg-gray-800 text-primary dark:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700",
        )}
        aria-label="List layout"
        aria-pressed={selectedLayout === "list"}
      >
        <LayoutList className="h-5 w-5" />
      </button>
    </div>
  );
}
