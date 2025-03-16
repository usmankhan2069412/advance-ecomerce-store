"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
  withCheckmark?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      isLoading = false,
      withCheckmark = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (withCheckmark) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
      onClick?.(e);
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const variantClasses = {
      primary: "bg-primary text-secondary hover:bg-opacity-90",
      secondary:
        "bg-secondary text-primary border border-primary hover:bg-primary hover:text-secondary",
      accent: "bg-accent-gold text-primary hover:bg-opacity-90",
      ghost: "bg-transparent hover:bg-secondary text-primary",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          sizeClasses[size],
          variantClasses[variant],
          withCheckmark && "add-to-cart-btn",
          isAdded && "added",
          className,
        )}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {withCheckmark ? (
          <>
            <span className="text">{children}</span>
            <Check className="checkmark h-5 w-5" />
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
