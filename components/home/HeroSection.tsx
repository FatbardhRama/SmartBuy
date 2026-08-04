import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative border-b border-border/70 bg-card">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-primary/5 lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary">
            <BadgeCheck className="size-4" />
            Your electronics marketplace
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Shop the latest electronics.
            <span className="block text-primary">Upgrade your tech today.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Discover premium laptops, smartphones, monitors, audio gear, and
            accessories from trusted sellers—all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Explore All Electronics <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Shop Today&apos;s Deals
              </Button>
            </Link>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-1 gap-3 border-t border-border/80 pt-6 text-sm text-muted-foreground sm:grid-cols-3">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Secure checkout</span>
            <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Verified sellers</span>
            <span className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Order tracking</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div className="absolute -left-5 top-12 size-28 rounded-full bg-accent/60 blur-2xl" />
          <div className="absolute -right-6 bottom-10 size-40 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative grid grid-cols-[1.15fr_0.85fr] gap-3 rounded-3xl border border-border/80 bg-background/80 p-3 shadow-xl sm:gap-4 sm:p-5">
            <div className="relative min-h-80 overflow-hidden rounded-2xl bg-secondary sm:min-h-[430px]">
              <Image
                src="/products/apple-macbook-pro.jpg"
                alt="MacBook Pro available on SmartBuy"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 55vw, 32vw"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/30 bg-white/90 p-3 shadow-md backdrop-blur dark:border-white/10 dark:bg-slate-950/85 sm:inset-x-4 sm:bottom-4 sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Laptop spotlight</p>
                <p className="mt-1 font-semibold sm:text-lg">Performance for every idea</p>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4">
              <div className="relative min-h-36 overflow-hidden rounded-2xl bg-secondary sm:min-h-52">
                <Image
                  src="/products/iphone14-pro.jpg"
                  alt="Smartphone available on SmartBuy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 20vw"
                />
              </div>
              <div className="relative min-h-36 overflow-hidden rounded-2xl bg-secondary sm:min-h-52">
                <Image
                  src="/products/blue-earbuds.jpg"
                  alt="Wireless earbuds available on SmartBuy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 20vw"
                />
                <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-sm">
                  Audio deal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
