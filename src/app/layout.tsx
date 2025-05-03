import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SonnerToaster } from '@/components/ui/sonner-toaster';
import CartWrapper from '@/components/CartWrapper';
import AuthStateSync from '@/components/AuthStateSync';
import ErrorHandlingScript from '@/components/ErrorHandlingScript';


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
      <ErrorHandlingScript />
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
          <AuthProvider>
            <AuthStateSync />
            <CartProvider>
              <FavoritesProvider>
                <CartWrapper>
                  {children}
                </CartWrapper>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        <SonnerToaster />
        <TempoInit />
      </body>
    </html>
  );
}
