"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/context/CartContext";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastViewport } from "@/components/ui/toast";


export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >

      <SessionProvider>

        <CartProvider>

          <Header />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
          <ToastViewport />

        </CartProvider>

      </SessionProvider>

    </ThemeProvider>
  );
}