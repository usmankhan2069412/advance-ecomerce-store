"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
}

interface AISearchBarProps {
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

const AISearchBar = ({
  onSearch = () => {},
  onResultSelect = () => {},
  className = "",
}: AISearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([
    {
      id: "1",
      name: "Silk Evening Gown",
      category: "Dresses",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&q=80",
      price: "$1,299",
    },
    {
      id: "2",
      name: "Cashmere Overcoat",
      category: "Outerwear",
      image:
        "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=80",
      price: "$2,450",
    },
    {
      id: "3",
      name: "Leather Ankle Boots",
      category: "Footwear",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80",
      price: "$895",
    },
  ]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        // This would be an API call in a real implementation
        console.log("Searching for:", query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowResults(true);
      // In a real implementation, this would fetch results from an API
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowResults(false);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use the Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setQuery("luxury evening wear with sustainable materials");
        setIsListening(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    setShowResults(false);
  };

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative w-full max-w-[800px] mx-auto bg-background",
        className,
      )}
    >
      <div className="relative flex items-center rounded-full border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center pl-4 text-muted-foreground">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search for luxury items or ask AI for style advice..."
          className="w-full py-3 px-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />

        <div className="flex items-center gap-1 pr-2">
          {query && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleClear}
              className="h-8 w-8 rounded-full"
            >
              <X size={18} />
            </Button>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleVoiceSearch}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    isListening && "text-primary animate-pulse",
                  )}
                >
                  <Mic size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search with voice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleSearch}
                  className="h-8 w-8 rounded-full text-primary"
                >
                  <Sparkles size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI-powered search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-2 z-50 max-h-[400px] overflow-y-auto shadow-lg">
          {query && (
            <div className="p-2 text-sm text-muted-foreground border-b">
              <p>
                Showing results for{" "}
                <span className="font-medium text-foreground">"{query}"</span>
              </p>
            </div>
          )}

          <div className="divide-y">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{result.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.category}
                  </p>
                  <p className="text-sm font-semibold mt-1">{result.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Sparkles size={12} />
            <span>Powered by AI fashion understanding</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AISearchBar;
