"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShieldCheck, ShoppingBag } from "lucide-react";

export function Footer() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <footer className="mt-auto border-t border-border/80 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm text-primary-foreground shadow-sm">S</span>
            Smart<span className="-ml-2 text-primary">Buy</span>
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            A trusted electronics marketplace for discovering devices, supporting approved tech sellers, and shopping with confidence.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold">Marketplace</h2>
          <nav className="grid gap-3 text-sm text-muted-foreground" aria-label="Marketplace links">
            <Link href="/products" className="transition-colors hover:text-primary">Products</Link>
            <Link href="/stores" className="transition-colors hover:text-primary">Stores</Link>
            <Link href="/deals" className="transition-colors hover:text-primary">Deals</Link>
            <Link href="/sell" className="transition-colors hover:text-primary">Sell on SmartBuy</Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold">Customer support</h2>
          <nav className="grid gap-3 text-sm text-muted-foreground" aria-label="Customer support links">
            <Link href="/orders" className="transition-colors hover:text-primary">Track your orders</Link>
            <Link href="/profile" className="transition-colors hover:text-primary">Account settings</Link>
            <Link href="/wishlist" className="transition-colors hover:text-primary">Wishlist</Link>
            <Link href="/cart" className="transition-colors hover:text-primary">Shopping cart</Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold">Your workspace</h2>
          <nav className="grid gap-3 text-sm text-muted-foreground" aria-label="Workspace links">
            {session ? (
              <>
                <Link href="/profile" className="inline-flex items-center gap-2 transition-colors hover:text-primary"><ShoppingBag className="size-4" /> My account</Link>
                <Link href="/sell" className="transition-colors hover:text-primary">Seller workspace</Link>
                {isAdmin && <Link href="/admin" className="inline-flex items-center gap-2 font-medium text-primary"><ShieldCheck className="size-4" /> Admin Panel</Link>}
              </>
            ) : (
              <>
                <Link href="/login" className="transition-colors hover:text-primary">Sign in</Link>
                <Link href="/register" className="font-medium text-primary">Create an account</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SmartBuy. All rights reserved.</p>
          <p>Upgrade your tech. Buy with confidence.</p>
        </div>
      </div>
    </footer>
  );
}
