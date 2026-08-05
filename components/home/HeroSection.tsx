import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(6,182,212,0.12),transparent_28%),radial-gradient(circle_at_68%_82%,rgba(37,99,235,0.10),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-18 pt-12 sm:pb-22 sm:pt-16 lg:min-h-[650px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:py-20">
        <div className="max-w-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/15">
            <BadgeCheck className="size-4" />
            Electronics from approved sellers
          </div>

          <h1 className="text-[2.75rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.35rem]">
            Better tech starts with a
            <span className="text-primary"> smarter choice.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Compare laptops, smartphones, audio, and accessories from trusted
            sellers in one focused marketplace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full gap-3 rounded-xl px-6 sm:w-auto">
                Explore electronics
                <span className="flex size-7 items-center justify-center rounded-lg bg-white/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </Button>
            </Link>
            <Link href="/deals" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-xl sm:w-auto">
                View today&apos;s deals
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> Secure payment</span>
            <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Approved sellers</span>
            <span className="flex items-center gap-2"><PackageCheck className="size-4 text-accent" /> Live stock status</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-5 motion-safe:duration-700 lg:mx-0">
          <div className="relative grid grid-cols-[1.18fr_0.82fr] gap-2 rounded-[1.75rem] bg-slate-200/70 p-2 shadow-[0_28px_80px_-36px_rgba(37,99,235,0.38)] ring-1 ring-slate-900/5 dark:bg-slate-800/70 sm:gap-3 sm:p-3">
            <div className="relative min-h-80 overflow-hidden rounded-[1.25rem] bg-muted sm:min-h-[440px]">
              <Image src="/products/apple-macbook-pro.jpg" alt="MacBook Pro in the SmartBuy laptop collection" fill priority className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02]" sizes="(max-width: 1024px) 55vw, 32vw" />
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/92 p-3 shadow-[0_14px_32px_-18px_rgba(15,23,42,0.35)] ring-1 ring-white/70 backdrop-blur-md dark:bg-slate-950/88 dark:ring-white/10 sm:inset-x-4 sm:bottom-4 sm:p-4">
                <p className="text-xs font-semibold text-primary">Laptop spotlight</p>
                <p className="mt-1 font-semibold sm:text-lg">Power for work and study</p>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3">
              <div className="relative min-h-36 overflow-hidden rounded-[1.25rem] bg-muted sm:min-h-52">
                <Image src="/products/iphone14-pro.jpg" alt="iPhone in the SmartBuy smartphone collection" fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]" sizes="(max-width: 1024px) 40vw, 20vw" />
              </div>
              <div className="relative min-h-36 overflow-hidden rounded-[1.25rem] bg-muted sm:min-h-52">
                <Image src="/products/blue-earbuds.jpg" alt="Blue wireless earbuds in the SmartBuy audio collection" fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]" sizes="(max-width: 1024px) 40vw, 20vw" />
                <span className="absolute right-3 top-3 rounded-lg bg-card/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm ring-1 ring-black/5 backdrop-blur-sm">Audio picks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
