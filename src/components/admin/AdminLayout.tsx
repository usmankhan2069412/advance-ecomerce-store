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
  Home,
  Package,
  ShoppingCart,
  Tag,
  ChevronDown,
  ChevronUp,
  Cog,
  Cpu,
  Brain,
  Globe,
  Lock,
  FileText,
  Zap
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: false,
    users: false,
    orders: false,
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/admin",
    },
    {
      name: "Products",
      icon: <Package className="w-5 h-5" />,
      dropdown: true,
      key: "products",
      children: [
        { name: "All Products", path: "/admin/products" },
        { name: "Add Product", path: "/admin/products/add" },
        { name: "Categories", path: "/admin/categories" },
        { name: "Attributes", path: "/admin/attributes" },
      ],
    },
    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      dropdown: true,
      key: "users",
      children: [
        { name: "All Users", path: "/admin/users" },
        { name: "Add User", path: "/admin/users/add" },
        { name: "Roles", path: "/admin/roles" },
      ],
    },
    {
      name: "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
      dropdown: true,
      key: "orders",
      children: [
        { name: "All Orders", path: "/admin/orders" },
        { name: "Pending", path: "/admin/orders/pending" },
        { name: "Completed", path: "/admin/orders/completed" },
      ],
    },
    {
      name: "Marketing",
      icon: <Tag className="w-5 h-5" />,
      path: "/admin/marketing",
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/admin/analytics",
    },
    {
      name: "AI Features",
      icon: <Brain className="w-5 h-5" />,
      path: "/admin/ai-features",
    },
    {
      name: "AI Documentation",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/ai-documentation",
    },
    {
      name: "Feature Enhancements",
      icon: <Zap className="w-5 h-5" />,
      path: "/admin/feature-enhancements",
    },
    {
      name: "Future Roadmap",
      icon: <Globe className="w-5 h-5" />,
      path: "/admin/future-enhancements",
    },
    {
      name: "Security & Compliance",
      icon: <Lock className="w-5 h-5" />,
      path: "/admin/security-compliance",
    },
    {
      name: "Technical Stack",
      icon: <Cpu className="w-5 h-5" />,
      path: "/admin/technical-stack",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed top-0 left-0 z-40 w-full bg-white shadow-sm md:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:w-64 md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenu(item.key)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${
                          expandedMenus[item.key] ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                        {expandedMenus[item.key] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      
                      {expandedMenus[item.key] && (
                        <ul className="pl-10 space-y-1">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link href={child.path}>
                                <span
                                  className={`block px-4 py-2 text-sm rounded-md ${
                                    isActive(child.path)
                                      ? 'bg-blue-500 text-white'
                                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                  }`}
                                >
                                  {child.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link href={item.path}>
                      <span
                        className={`flex items-center px-4 py-2 rounded-md ${
                          isActive(item.path)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
              
              <li className="mt-6">
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-16 md:hidden"></div>
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
