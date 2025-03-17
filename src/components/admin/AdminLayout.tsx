"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Palette,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      href: "/admin/products/inventory",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Categories",
      href: "/admin/products/categories",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "AI Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Artist Management",
      href: "/admin/artists",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      name: "Artist Designs",
      href: "/admin/artists/designs",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      name: "Artist Payouts",
      href: "/admin/artists/payouts",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Promotions",
      href: "/admin/cms/promotions",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Discount Codes",
      href: "/admin/promotions/discounts",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Security & Compliance",
      href: "/admin/security",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "User Roles",
      href: "/admin/security/roles",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Audit Logs",
      href: "/admin/security/audit",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Handle keydown for the overlay
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-black text-white fixed md:relative z-20 h-full transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 md:w-16 overflow-hidden",
        )}
      >
        <div
          className={cn(
            "p-6 flex items-center justify-between",
            !sidebarOpen && "md:justify-center md:p-4",
          )}
        >
          {sidebarOpen ? (
            <h1 className="text-2xl font-bold tracking-tighter">AETHERIA</h1>
          ) : (
            <h1 className="text-2xl font-bold tracking-tighter hidden md:block">
              A
            </h1>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-white md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 text-sm hover:bg-gray-800 transition-colors",
                    sidebarOpen ? "px-6" : "px-0 md:px-5 justify-center",
                    pathname === item.href &&
                      "bg-gray-800 border-l-4 border-white",
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <span className={sidebarOpen ? "mr-3" : ""}>{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            "absolute bottom-0 border-t border-gray-800 w-full",
            sidebarOpen ? "w-64" : "w-0 md:w-16",
          )}
        >
          <button
            type="button"
            className={cn(
              "flex items-center py-4 text-sm w-full hover:bg-gray-800 transition-colors",
              sidebarOpen ? "px-6" : "px-0 md:px-5 justify-center",
            )}
          >
            <LogOut className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={handleKeyDown}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="mr-4 md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={toggleSidebar}
                className="mr-4 hidden md:block"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <ChevronRight className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {navItems.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h2>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
