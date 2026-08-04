import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="pb-16 pt-2 sm:pb-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="rounded-3xl border border-primary/15 bg-primary/5 p-7 text-center shadow-sm sm:p-10 md:p-12">

          <h2 className="text-3xl font-bold">
            Stay in the SmartBuy loop
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Be first to discover new electronics, product launches, and
            limited-time tech offers.
          </p>

          <div className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row">

            <Input
              type="email"
              aria-label="Email address"
              placeholder="Enter your email address"
              className="flex-1 bg-card"
            />

            <Button className="sm:px-6">
              Subscribe
            </Button>

          </div>

        </div>

      </div>
    </section>
  );
}
