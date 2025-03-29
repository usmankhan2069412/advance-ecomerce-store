import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tempo - Modern SaaS Starter",
  description: "A modern full-stack starter template powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
