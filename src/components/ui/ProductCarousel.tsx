"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  children: React.ReactNode[];
  className?: string;
  showDots?: boolean;
  autoplay?: boolean;
  interval?: number;
}

export function ProductCarousel({
  children,
  className,
  showDots = true,
  autoplay = false,
  interval = 5000,
}: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateIndex = (newIndex: number) => {
    let index = newIndex;
    if (newIndex < 0) {
      index = children.length - 1;
    } else if (newIndex >= children.length) {
      index = 0;
    }
    setActiveIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
    onSwiping: () => setIsDragging(true),
    onSwiped: () => setTimeout(() => setIsDragging(false), 100),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  useEffect(() => {
    if (autoplay) {
      timerRef.current = setInterval(() => {
        updateIndex(activeIndex + 1);
      }, interval);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoplay, interval, activeIndex]);

  return (
    <div className={cn("relative", className)} {...handlers}>
      <div
        className="overflow-hidden"
        aria-live="polite"
        aria-roledescription="carousel"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="min-w-full"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${children.length}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          updateIndex(activeIndex - 1);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary dark:text-secondary hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          updateIndex(activeIndex + 1);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary dark:text-secondary hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => updateIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                activeIndex === index
                  ? "bg-accent-gold"
                  : "bg-white/50 dark:bg-gray-600/50 hover:bg-white dark:hover:bg-gray-600",
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
