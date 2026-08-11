"use client";

import Link from "next/link";
import { type FormEvent, type MouseEvent, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const router = useRouter();
  const { data: session } = useSession();
  const { itemCount, loaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!session?.user?.id) {
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

  const effectiveStoreStatus = session?.user?.id ? storeStatus : null;
  const isApprovedSeller = effectiveStoreStatus === "APPROVED";
  const isAdmin = session?.user?.role === "ADMIN";
  const accountLabel = session?.user?.name?.split(" ")[0] || "Account";

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMenuOpen(false);
  }

  function handleMobileNavigationClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#020617]/96 text-slate-100 shadow-[0_14px_34px_-24px_rgba(2,6,23,0.72)] backdrop-blur-xl supports-backdrop-filter:bg-[#020617]/88">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
          aria-label="SmartBuy home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#2563EB,#06B6D4)] text-sm font-bold text-primary-foreground shadow-[0_12px_28px_-14px_rgba(37,99,235,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
            S
          </span>
          <span className="font-heading text-xl font-bold tracking-[-0.035em] text-white">Smart<span className="text-cyan-300">Buy</span></span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25",
                  active && "bg-blue-500/15 text-cyan-200",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={handleSearch} role="search" className="relative ml-auto hidden min-w-0 max-w-xs flex-1 xl:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search electronics"
            aria-label="Search electronics"
            className="h-10 border-white/10 bg-white/[0.07] pl-9 pr-14 text-slate-100 shadow-none placeholder:text-slate-400 focus-visible:border-cyan-300/60 focus-visible:bg-white/[0.1] focus-visible:ring-cyan-300/15"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 2xl:block">Enter</span>
        </form>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 lg:flex xl:ml-1">
          <Link
            href="/cart"
            aria-current={isActivePath(pathname, "/cart") ? "page" : undefined}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.1] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25",
              isActivePath(pathname, "/cart") && "border-blue-400/35 bg-blue-500/15 text-cyan-100",
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

          {session && effectiveStoreStatus && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="gap-1.5 text-slate-200 hover:bg-white/[0.08] hover:text-white" />}
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
                "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25",
                isActivePath(pathname, "/admin") && "bg-blue-500/15 text-cyan-100",
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
                render={<Button variant="outline" className="max-w-44 gap-2 border-white/10 bg-white/[0.06] text-slate-100 hover:border-cyan-300/25 hover:bg-white/[0.1] hover:text-white" />}
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
              <Link href="/login"><Button variant="ghost" className="text-slate-200 hover:bg-white/[0.08] hover:text-white">Sign in</Button></Link>
              <Link href="/register"><Button>Create account</Button></Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:hidden">
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-100 shadow-[0_10px_24px_-22px_rgba(2,6,23,0.72)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25"
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
            className="border-white/10 bg-white/[0.06] text-slate-100 hover:border-cyan-300/25 hover:bg-white/[0.1] hover:text-white"
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
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-[#020617]/98 text-slate-100 shadow-[0_18px_38px_-28px_rgba(2,6,23,0.8)] backdrop-blur-xl lg:hidden motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2"
          onClick={handleMobileNavigationClick}
        >
          <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
            <form onSubmit={handleSearch} role="search" className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products and categories"
                aria-label="Search products and categories"
                className="h-11 border-white/10 bg-white/[0.07] pl-9 pr-12 text-slate-100 placeholder:text-slate-400 focus-visible:border-cyan-300/60 focus-visible:bg-white/[0.1] focus-visible:ring-cyan-300/15"
              />
              <Button type="submit" size="icon-sm" className="absolute right-1.5 top-1.5 rounded-lg" aria-label="Submit search">
                <Search className="size-4" />
              </Button>
            </form>

            <nav className="grid gap-1" aria-label="Mobile primary navigation">
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25",
                      active && "bg-blue-500/15 text-cyan-100",
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
                    <Link href="/profile" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">Profile</Link>
                    <Link href="/orders" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">My Orders</Link>
                    <Link href="/wishlist" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">Wishlist</Link>
                  </div>
                </div>

                {(effectiveStoreStatus || isAdmin) && (
                  <div>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
                    <div className="grid gap-1">
                      {effectiveStoreStatus && <Link href="/sell" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">My Store</Link>}
                      {isApprovedSeller && <Link href="/seller" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">Seller Dashboard</Link>}
                      {isApprovedSeller && <Link href="/seller/products" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">My Products</Link>}
                      {isApprovedSeller && <Link href="/seller/orders" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white">Seller Orders</Link>}
                      {isAdmin && <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-white/[0.08]">Admin Panel</Link>}
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
