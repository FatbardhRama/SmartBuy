import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import AppProviders from "@/components/providers/AppProviders";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "SmartBuy | Electronics Marketplace",
  description: "Shop laptops, smartphones, monitors, audio, and accessories from trusted electronics sellers.",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="flex min-h-full flex-col overflow-x-hidden">

        <AppProviders>
          {children}
        </AppProviders>

      </body>


    </html>

  );

}
