"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Collections", href: "/collections" },
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Accessories", href: "/accessories" },
    { label: "AI Studio", href: "/ai-studio" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchValue);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 flex items-center justify-between transition-colors duration-300",
        transparent && !isScrolled
          ? "bg-transparent text-white"
          : isScrolled
            ? "bg-black text-white shadow-sm"
            : "bg-white text-black shadow-sm",
      )}
    >
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          AETHERIA
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-gray-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <form
          onSubmit={handleSearch}
          className="relative hidden md:flex items-center"
        >
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-64 pr-8"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" className="relative">
          <span className="absolute -top-1 -right-0 text-white text-xs bg-black rounded-full h-4 w-4 flex items-center justify-center">
            0
          </span>
          <ShoppingBag className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
