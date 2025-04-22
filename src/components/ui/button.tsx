"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode, useState, useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "outline" | "link";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
  withCheckmark?: boolean;
  asChild?: boolean;
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

    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (withCheckmark && !isAdded) {
        setIsAdded(true);
        onClick?.(e);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAdded(false);
      } else {
        onClick?.(e);
      }
    }, [onClick, withCheckmark, isAdded]);

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
      outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-secondary",
      link: "bg-transparent text-primary hover:underline p-0 h-auto",
    };

    // Check if the button has the no-hover class
    const hasNoHoverClass = className?.includes('no-hover');

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          sizeClasses[size],
          hasNoHoverClass ? variantClasses[variant].replace(/hover:[^ ]*/g, '') : variantClasses[variant],
          withCheckmark && "btn-morphing",
          isAdded && "success",
          className,
        )}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading}
        {...Object.entries(props).reduce((acc, [key, value]) => {
          if (key !== 'asChild') (acc as any)[key] = value;
          return acc;
        }, {})}
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
