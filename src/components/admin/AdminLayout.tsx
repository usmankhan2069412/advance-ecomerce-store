"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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

/**
 * Admin Layout Component
 * Provides the layout structure for all admin pages with authentication
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: false,
    users: false,
    orders: false,
  });

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, don't render the admin layout
  if (!isAuthenticated) {
    return null;
  }

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    logout();
    router.push("/admin/login");
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
        { name: "Add Product", path: "/admin/products/new" },
        { name: "Inventory Management", path: "/admin/products/inventory" }, // Added Inventory link
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
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-md bg-white p-2 shadow-md md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b px-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenu(item.key)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 ${expandedMenus[item.key] ? 'bg-gray-100' : ''
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
                                  className={`block px-4 py-2 text-sm rounded-md ${isActive(child.path)
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
                    <Link
                      href={item.path || '#'}
                      className={`flex items-center px-4 py-2 rounded-md ${isActive(item.path || '')
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}

              <li className="mt-6">
                <button
                  onClick={handleLogout}
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
