import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const trustPoints = [
  { label: "Secure payment", icon: ShieldCheck },
  { label: "Approved sellers", icon: BadgeCheck },
  { label: "Live stock status", icon: PackageCheck },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071426] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.42),transparent_24rem),radial-gradient(circle_at_60%_70%,rgba(6,182,212,0.10),transparent_28rem),linear-gradient(112deg,#071426_7%,#102852_58%,#123E52_135%)] dark:bg-[radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.22),transparent_24rem),linear-gradient(112deg,#07111F_7%,#0C1B34_58%,#102A39_135%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/85 to-transparent sm:h-48" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 sm:pb-20 sm:pt-18 lg:min-h-[660px] lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 lg:py-20">
        <div className="max-w-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-200/20 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <Sparkles className="size-3.5 text-cyan-300" />
            TECHNOLOGY, CURATED
          </div>

          <h1 className="max-w-2xl text-[2.9rem] font-bold leading-[0.98] tracking-[-0.055em] text-balance sm:text-6xl lg:text-[4.6rem]">
            Better tech for the way you <span className="text-cyan-200">move through life.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            Discover dependable laptops, phones, audio, and accessories from approved SmartBuy sellers—all in one focused marketplace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full gap-3 rounded-xl px-5 sm:w-auto">
                Explore electronics
                <span className="flex size-7 items-center justify-center rounded-lg bg-white/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </Button>
            </Link>
            <Link href="/deals" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-xl border-white/20 bg-white/[0.06] text-white shadow-none hover:border-cyan-200/40 hover:bg-white/[0.14] hover:text-white sm:w-auto">
                View today&apos;s deals
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-3 rounded-xl border border-white/10 bg-slate-950/65 px-3 py-3 backdrop-blur-sm dark:bg-slate-950/55 sm:grid-cols-3 sm:gap-4">
            {trustPoints.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-slate-100">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-cyan-300 ring-1 ring-inset ring-white/10">
                  <Icon className="size-4" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[42rem] pb-6 pt-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-5 motion-safe:duration-700 lg:mx-0 lg:pb-0">
          <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-16 rounded-[100%] bg-cyan-400/15 blur-2xl dark:bg-cyan-400/8" />
          <div className="relative ml-auto aspect-[1.12/1] w-[94%] rounded-[2rem] border border-white/15 bg-white/[0.08] p-2 shadow-[0_38px_100px_-42px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-3">
            <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-slate-100">
              <Image
                src="/products/apple-macbook-pro.jpg"
                alt="Apple MacBook Pro from SmartBuy"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 42vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(2,6,23,0.76)_100%)]" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200">LAPTOP SPOTLIGHT</p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">Designed for deep work</p>
                </div>
                <span className="hidden rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:block">In stock</span>
              </div>
            </div>
          </div>

          <div className="absolute -left-1 top-[9%] w-[31%] overflow-hidden rounded-2xl border border-white/20 bg-white/[0.1] p-1.5 shadow-[0_20px_48px_-20px_rgba(2,6,23,0.85)] backdrop-blur-md sm:-left-5 sm:p-2">
            <div className="relative aspect-[0.82] overflow-hidden rounded-xl bg-slate-200">
              <Image src="/products/iphone14-pro.jpg" alt="iPhone from SmartBuy" fill className="object-cover" sizes="(max-width: 640px) 28vw, 15vw" />
            </div>
            <p className="px-1 pb-0.5 pt-2 text-[10px] font-semibold tracking-wide text-cyan-100 sm:text-xs">PHONES</p>
          </div>

          <div className="absolute -bottom-1 right-0 w-[39%] overflow-hidden rounded-2xl border border-white/20 bg-[#0f172a]/85 p-1.5 shadow-[0_22px_52px_-20px_rgba(2,6,23,0.9)] backdrop-blur-md sm:-right-3 sm:p-2">
            <div className="relative aspect-[1.3] overflow-hidden rounded-xl bg-slate-800">
              <Image src="/products/black-nitro-headphones.jpg" alt="Wireless headphones from SmartBuy" fill className="object-cover" sizes="(max-width: 640px) 34vw, 18vw" />
            </div>
            <div className="flex items-center justify-between gap-2 px-1 pb-0.5 pt-2">
              <p className="text-[10px] font-semibold tracking-wide text-cyan-100 sm:text-xs">AUDIO</p>
              <span className="size-1.5 rounded-full bg-cyan-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
