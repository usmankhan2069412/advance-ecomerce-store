import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "product-card" | "image";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton = ({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
  ...props
}: SkeletonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 w-full rounded";
      case "circular":
        return "rounded-full";
      case "rectangular":
        return "rounded-md";
      case "image":
        return "rounded-md";
      case "product-card":
        return "h-[350px] w-full rounded-md";
      default:
        return "";
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case "pulse":
        return "animate-pulse-slow";
      case "wave":
        return "skeleton-wave";
      default:
        return "";
    }
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
      style={style}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton variant="product-card" />
    <Skeleton variant="text" width="70%" />
    <Skeleton variant="text" width="40%" />
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
  </div>
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array(lines)
      .fill(0)
      .map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? "80%" : "100%"} />
      ))}
  </div>
); 