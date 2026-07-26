"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link
          href="/"
          className="text-2xl font-bold"
        >
          SmartBuy
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Products
          </Link>

          <Link href="/categories">
            Categories
          </Link>

          <Link href="/deals">
            Deals
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}