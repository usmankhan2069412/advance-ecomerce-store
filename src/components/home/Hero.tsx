"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowRight, ShoppingBag } from "lucide-react";

/**
 * Hero component for the homepage
 * Displays the main promotional content with AI fashion features
 */
const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600/30 to-primary-800/20" />
        <div className="h-full w-full bg-[url('/patterns/grid.svg')]" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Hero content */}
          <div className="z-10 order-2 lg:order-1">
            <h1 className="mb-6 font-secondary text-4xl font-bold leading-tight tracking-tight text-primary-800 dark:text-white sm:text-5xl md:text-6xl">
              Discover Fashion <br />
              <span className="text-accent-600">Enhanced by AI</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg text-gray-600 dark:text-gray-300">
              Experience the future of shopping with our AI-powered platform.
              Try on clothes virtually, get personalized recommendations, and
              discover unique designs from independent artists.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/products">
                <Button size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>

              <Link href="/ai-features">
                <Button variant="secondary" size="lg">
                  Explore AI Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {/* Ensure no link or button related to runway video exists */}
              {/* <Link href="/runway-video.mp4">
                <Button variant="outline" size="lg">
                  Watch Runway Video
                </Button>
              </Link> */}
            </div>

            <div className="mt-10 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
                  >
                    <Image
                      src={`/images/avatars/avatar-${i}.jpg`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="object-cover"
                      onError={(e) => {
                        // Fix the incorrect path by removing the leading dots
                        e.currentTarget.src =
                          "/images/hero/beautiful-young-woman-wearing-professional-makeup.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Trusted by 10,000+ customers
                </p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    4.9/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="z-10 order-1 lg:order-2">
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl sm:h-[500px] md:h-[600px]">
              <Image
                src="/images/hero/hero-image.jpg"
                alt="AI Fashion Platform"
                fill
                priority
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/hero/default-hero.jpg";
                  e.currentTarget.alt = "Default hero image";
                }}
              />

              {/* Floating feature cards - only visible on larger screens */}
              <div className="absolute -left-6 top-1/4 hidden w-48 rounded-lg bg-white p-3 shadow-lg dark:bg-dark-surface sm:block sm:w-56 md:w-64">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      AI-Powered
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Virtual Try-On
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-1/4 hidden w-48 rounded-lg bg-white p-3 shadow-lg dark:bg-dark-surface sm:block sm:w-56 md:w-64">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                    <svg
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Personalized
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
