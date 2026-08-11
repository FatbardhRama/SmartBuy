"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, ShieldCheck, ShoppingBag } from "lucide-react";

const marketplaceLinks = [
  { href: "/products", label: "Browse products" },
  { href: "/stores", label: "Approved stores" },
  { href: "/deals", label: "Today's deals" },
  { href: "/sell", label: "Sell on SmartBuy" },
];

const accountLinks = [
  { href: "/orders", label: "Track your orders" },
  { href: "/profile", label: "Account settings" },
  { href: "/wishlist", label: "Saved products" },
  { href: "/cart", label: "Shopping cart" },
];

const linkClassName =
  "group inline-flex w-fit items-center gap-1.5 rounded-md text-sm leading-6 text-slate-400 transition-colors duration-200 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25";

export function Footer() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr] lg:gap-10">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
              aria-label="SmartBuy home"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#2563EB,#06B6D4)] text-sm font-bold text-primary-foreground shadow-[0_12px_28px_-14px_rgba(37,99,235,0.9)]">S</span>
              <span className="font-heading text-xl font-bold tracking-[-0.035em] text-white">Smart<span className="text-cyan-300">Buy</span></span>
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              A focused electronics marketplace connecting shoppers with useful technology from approved sellers.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/10">
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
                  <Link href="/admin" className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-cyan-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25">
                    <ShieldCheck className="size-4" aria-hidden="true" /> Admin panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className={linkClassName}>Sign in</Link>
                <Link href="/register" className="group inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-semibold text-cyan-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/25">
                  Create an account
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </>
            )}
          </FooterGroup>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0f172a]/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{"\u00A9"} {new Date().getFullYear()} SmartBuy. All rights reserved.</p>
          <p>Independent electronics marketplace for smarter everyday buying.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-slate-100">{title}</h2>
      <nav className="grid gap-2.5" aria-label={`${title} links`}>
        {children}
      </nav>
    </div>
  );
}
