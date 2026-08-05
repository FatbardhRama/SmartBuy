import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="pb-18 pt-2 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-primary px-6 py-10 text-primary-foreground shadow-[0_28px_70px_-36px_rgba(37,99,235,0.65)] sm:px-10 sm:py-12 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[48px] border-white/5" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
            <div>
              <p className="text-sm font-semibold text-blue-100">SmartBuy updates</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Good tech finds, sent occasionally</h2>
              <p className="mt-4 max-w-xl leading-7 text-blue-100">Discover new electronics, marketplace arrivals, and limited-time offers without the noise.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input type="email" aria-label="Email address" placeholder="Enter your email address" className="h-12 flex-1 border-white/25 bg-white text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-white/30" />
              <Button className="h-12 bg-slate-950 px-6 text-white shadow-none hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-50">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
