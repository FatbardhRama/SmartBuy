"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, ShieldCheck, ShoppingBag } from "lucide-react";

const marketplaceLinks = [
  { href: "/products", label: "Browse products" },
  { href: "/stores", label: "Approved stores" },
  { href: "/deals", label: "Today’s deals" },
  { href: "/sell", label: "Sell on SmartBuy" },
];

const accountLinks = [
  { href: "/orders", label: "Track your orders" },
  { href: "/profile", label: "Account settings" },
  { href: "/wishlist", label: "Saved products" },
  { href: "/cart", label: "Shopping cart" },
];

const linkClassName =
  "group inline-flex w-fit items-center gap-1.5 rounded-md text-sm leading-6 text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15";

export function Footer() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <footer className="mt-auto border-t border-border/70 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr] lg:gap-10">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
              aria-label="SmartBuy home"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-10px_rgba(37,99,235,0.8)]">S</span>
              <span className="font-heading text-xl font-bold tracking-[-0.035em]">Smart<span className="text-primary">Buy</span></span>
            </Link>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              A focused electronics marketplace connecting shoppers with useful technology from approved sellers.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-success/8 px-3 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-success/15">
              <ShieldCheck className="size-4 text-success" aria-hidden="true" />
              Secure shopping from checkout to delivery
            </div>
          </div>

          <FooterGroup title="Marketplace">
            {marketplaceLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </FooterGroup>

          <FooterGroup title="Your account">
            {accountLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </FooterGroup>

          <FooterGroup title="Workspace">
            {session ? (
              <>
                <Link href="/profile" className={linkClassName}>
                  <ShoppingBag className="size-4" aria-hidden="true" /> My account
                </Link>
                <Link href="/sell" className={linkClassName}>Seller workspace</Link>
                {isAdmin && (
                  <Link href="/admin" className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15">
                    <ShieldCheck className="size-4" aria-hidden="true" /> Admin panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className={linkClassName}>Sign in</Link>
                <Link href="/register" className="group inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15">
                  Create an account
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </>
            )}
          </FooterGroup>
        </div>
      </div>

      <div className="border-t border-border/70 bg-background/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SmartBuy. All rights reserved.</p>
          <p>Independent electronics marketplace for smarter everyday buying.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      <nav className="grid gap-2.5" aria-label={`${title} links`}>
        {children}
      </nav>
    </div>
  );
}
