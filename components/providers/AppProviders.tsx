"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/context/CartContext";

import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { ToastViewport } from "@/components/ui/toast";
import { ShoppingAssistant } from "@/components/assistant/ShoppingAssistant";


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

          <main className="min-w-0 flex-1 pb-10">
            <Breadcrumbs />
            {children}
          </main>

          <Footer />
          <ToastViewport />
          <ShoppingAssistant />

        </CartProvider>

      </SessionProvider>

    </ThemeProvider>
  );
}
