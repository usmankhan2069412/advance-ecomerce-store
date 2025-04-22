"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Use client-side only rendering for inputs to avoid hydration mismatches
    // caused by browser extensions that modify email inputs
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Use the base styles
    const baseStyles = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    // If not mounted yet (server-side), return a placeholder div with the same dimensions
    // to prevent layout shift
    if (!isMounted && type === "email") {
      return (
        <div
          className={cn(baseStyles, className)}
          style={{ height: "36px" }}
          aria-hidden="true"
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(baseStyles, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
