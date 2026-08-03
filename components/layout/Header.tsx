"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Heart, Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { data: session } = useSession();
  const { itemCount, loaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const primaryLinks = (
    <>
      <Link href="/" onClick={closeMenu}>Home</Link>
      <Link href="/products" onClick={closeMenu}>Products</Link>
      <Link href="/deals" onClick={closeMenu}>Deals</Link>
      <Link href="/wishlist" onClick={closeMenu} className="flex items-center gap-1">
        <Heart className="size-4" />
        Wishlist
      </Link>
      <Link href="/cart" onClick={closeMenu} className="flex items-center gap-1">
        Cart
        {loaded && itemCount > 0 && (
          <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
            {itemCount}
          </span>
        )}
      </Link>
    </>
  );

  const accountActions = (
    <>
      {session ? (
        <>
          <span className="text-sm text-muted-foreground">Hello, {session.user?.name}</span>
          <Link href="/profile" onClick={closeMenu}><Button variant="outline">Profile</Button></Link>
          <Link href="/orders" onClick={closeMenu}><Button variant="outline">My Orders</Button></Link>
          {session.user?.role === "ADMIN" && (
            <Link href="/admin" onClick={closeMenu}><Button variant="outline">Admin</Button></Link>
          )}
          <Button onClick={() => signOut()}>Logout</Button>
        </>
      ) : (
        <>
          <Link href="/login" onClick={closeMenu}><Button variant="outline">Login</Button></Link>
          <Link href="/register" onClick={closeMenu}><Button>Register</Button></Link>
        </>
      )}
    </>
  );

  return (
    <header className="border-b">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold sm:text-2xl">SmartBuy</Link>

        <nav className="hidden items-center gap-4 text-sm xl:flex xl:gap-6" aria-label="Primary navigation">
          {primaryLinks}
        </nav>

        <div className="hidden items-center gap-2 xl:flex xl:gap-3">
          <ThemeToggle />
          {accountActions}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 xl:hidden">
          <div className="container mx-auto space-y-4 px-4 py-4 sm:px-6">
            <nav className="grid gap-1 text-sm" aria-label="Mobile primary navigation">
              {primaryLinks}
            </nav>
            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
              {accountActions}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
