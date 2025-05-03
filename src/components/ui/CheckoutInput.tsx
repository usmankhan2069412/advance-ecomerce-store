'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface CheckoutInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CheckoutInput = React.forwardRef<HTMLInputElement, CheckoutInputProps>(
  ({ className, type, ...props }, ref) => {
    // Use client-side only rendering for email inputs to avoid hydration mismatches
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // If not mounted yet (server-side) and it's an email input, return a placeholder div
    if (!isMounted && type === "email") {
      return (
        <div
          className={cn(
            "flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm transition-all duration-200",
            className
          )}
          aria-hidden="true"
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={isMounted ? props.value : ''}
        {...props}
      />
    );
  },
);
CheckoutInput.displayName = "CheckoutInput";

export { CheckoutInput };
