"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  videoUrl?: string;
  featuredProducts?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }>;
}

const HeroSection = ({
  videoUrl = "/runway-video.mp4",
  featuredProducts = [
    {
      id: "1",
      name: "Ethereal Silk Gown",
      price: 2950,
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      category: "Dresses",
    },
    {
      id: "2",
      name: "Avant-Garde Blazer",
      price: 1850,
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
      category: "Outerwear",
    },
    {
      id: "3",
      name: "Celestial Accessories Set",
      price: 1250,
      image:
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
      category: "Accessories",
    },
  ],
}: HeroSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate parallax effect based on scroll position
  const parallaxOffset = scrollPosition * 0.3;

  return (
    <section className="relative h-[800px] w-full overflow-hidden bg-black">
      {/* Video Background with Parallax Effect */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* Fallback image while video loads */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80)",
            }}
          />
        )}

        {/* Video element */}
        <video
          className={`object-cover w-full h-full ${isVideoLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          preload="auto"
          poster="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full w-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          <span className="block">Redefine</span>
          <span className="block">Luxury</span>
        </h1>
        <p className="text-xl text-white/80 max-w-md mb-8">
          AI-curated collections tailored to your unique style profile.
          Experience fashion that understands you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-white/90">
            Shop Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            Discover AI Styling
          </Button>
        </div>

        {/* Featured Products Overlay */}
        <div className="absolute bottom-16 right-6 left-6 md:left-auto">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 w-full md:w-[400px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium">AI-Curated For You</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white p-0"
              >
                View All <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-md mb-1">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-white text-xs truncate">{product.name}</p>
                  <p className="text-white/70 text-xs">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce mt-1" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
