"use client";

import React, { memo } from "react";
import { Leaf, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SustainabilityLevel = "high" | "medium" | "low";

type SustainabilityMetric = {
  name: string;
  value: string;
  description: string;
};

interface SustainabilityIndicatorProps {
  level?: SustainabilityLevel;
  metrics?: SustainabilityMetric[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const levelColors = {
  high: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  low: "bg-red-100 text-red-700 border-red-300",
};

function SustainabilityIndicator({
  level = "medium",
  metrics = [
    {
      name: "Carbon Footprint",
      value: "12kg CO₂",
      description: "40% less than industry average",
    },
    {
      name: "Water Usage",
      value: "800L",
      description: "Recycled water processes used",
    },
    {
      name: "Ethical Labor",
      value: "100%",
      description: "Fair wage certified factories",
    },
  ],
  size = "md",
  className,
}: SustainabilityIndicatorProps) {
  // Pre-compute values outside of render
  const colorClass =
    level === "high"
      ? "text-emerald-700"
      : level === "medium"
        ? "text-amber-700"
        : "text-red-700";

  const sustainabilityText =
    level === "high"
      ? "Highly Sustainable"
      : level === "medium"
        ? "Moderately Sustainable"
        : "Low Sustainability";

  return (
    <div
      className={cn("relative", className)}
      style={{ backgroundColor: "white" }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "rounded-full flex items-center justify-center border-2 transition-all duration-300",
                sizeClasses[size],
                levelColors[level],
              )}
              aria-label="View sustainability information"
            >
              <Leaf className={cn("w-4 h-4", size === "lg" && "w-6 h-6")} />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="p-4 w-64 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className={cn("w-5 h-5", colorClass)} />
                <h3 className="font-medium text-gray-900">
                  {sustainabilityText}
                </h3>
              </div>
              <div className="space-y-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {metric.name}: {metric.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-1">
                <p className="text-xs text-gray-500 italic">
                  Verified by Aetheria Sustainability Council
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default memo(SustainabilityIndicator);
