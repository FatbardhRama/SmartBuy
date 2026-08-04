"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CircleUserRound,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/stores", label: "Stores" },
  { href: "/deals", label: "Deals" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount, loaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState<string | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!session?.user?.id) {
      setStoreStatus(null);
      return;
    }

    let active = true;

    async function loadStore() {
      try {
        const response = await fetch("/api/seller/store");
        const data = await response.json();

        if (active && response.ok) {
          setStoreStatus(data.store?.status ?? null);
        }
      } catch {
        if (active) {
          setStoreStatus(null);
        }
      }
    }

    loadStore();

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const isApprovedSeller = storeStatus === "APPROVED";
  const isAdmin = session?.user?.role === "ADMIN";
  const accountLabel = session?.user?.name?.split(" ")[0] || "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-xs backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 font-heading text-xl font-bold tracking-tight"
          aria-label="SmartBuy home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            S
          </span>
          <span>Smart<span className="text-primary">Buy</span></span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href="/cart"
            aria-current={isActivePath(pathname, "/cart") ? "page" : undefined}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-semibold shadow-xs transition-colors hover:border-primary/30 hover:bg-secondary",
              isActivePath(pathname, "/cart") && "border-primary/30 bg-secondary text-primary",
            )}
          >
            <ShoppingCart className="size-4" />
            Cart
            {loaded && itemCount > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] leading-none text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {session && storeStatus && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="gap-1.5" />}
              >
                <Store className="size-4" />
                Seller
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Seller workspace</DropdownMenuLabel>
                  <DropdownMenuItem render={<Link href="/sell" />}>
                    <Store /> My Store
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {isApprovedSeller && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/seller" />}>
                      <LayoutDashboard /> Seller Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/seller/products" />}>
                      <Package /> My Products
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/seller/orders" />}>
                      <ReceiptText /> Seller Orders
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-secondary",
                isActivePath(pathname, "/admin") && "bg-secondary text-primary",
              )}
            >
              <ShieldCheck className="size-4" />
              Admin Panel
            </Link>
          )}

          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" className="max-w-44 gap-2" />}
              >
                <CircleUserRound className="size-4 shrink-0 text-primary" />
                <span className="truncate">{accountLabel}</span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate">
                    {session.user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <CircleUserRound /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/orders" />}>
                    <ReceiptText /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/wishlist" />}>
                    <Heart /> Wishlist
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost">Sign in</Button></Link>
              <Link href="/register"><Button>Create account</Button></Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center rounded-lg border border-input bg-background shadow-xs"
            aria-label={`Cart${loaded && itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingCart className="size-5" />
            {loaded && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
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
        <div
          id="mobile-navigation"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2"
        >
          <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
            <nav className="grid gap-1" aria-label="Mobile primary navigation">
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                      active && "bg-secondary text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {session ? (
              <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
                  <div className="grid gap-1">
                    <Link href="/profile" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Profile</Link>
                    <Link href="/orders" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">My Orders</Link>
                    <Link href="/wishlist" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Wishlist</Link>
                  </div>
                </div>

                {(storeStatus || isAdmin) && (
                  <div>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
                    <div className="grid gap-1">
                      {storeStatus && <Link href="/sell" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">My Store</Link>}
                      {isApprovedSeller && <Link href="/seller" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Seller Dashboard</Link>}
                      {isApprovedSeller && <Link href="/seller/products" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">My Products</Link>}
                      {isApprovedSeller && <Link href="/seller/orders" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Seller Orders</Link>}
                      {isAdmin && <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-secondary">Admin Panel</Link>}
                    </div>
                  </div>
                )}

                <Button variant="outline" className="sm:col-span-2" onClick={() => signOut()}>
                  <LogOut className="size-4" /> Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 border-t pt-5">
                <Link href="/login"><Button variant="outline" className="w-full">Sign in</Button></Link>
                <Link href="/register"><Button className="w-full">Create account</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
