import * as React from "react";
import { cn } from "../../lib/utils";

export interface CheckoutInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CheckoutInput = React.forwardRef<HTMLInputElement, CheckoutInputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={value !== undefined && value !== null ? value : ""}
        {...props}
      />
    );
  },
);
CheckoutInput.displayName = "CheckoutInput";

export { CheckoutInput };
