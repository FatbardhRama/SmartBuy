import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">

          <div className="space-y-6">

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Shop Smarter.
              <br />
              Save More.
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">
              Discover the best products with intelligent recommendations,
              smart deals, and a shopping experience designed for you.
            </p>

            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg">Start Shopping</Button>
              </Link>

              <Link href="/deals">
                <Button variant="outline" size="lg">
                  View Deals
                </Button>
              </Link>
            </div>

          </div>


          <div className="flex justify-center">
            <div className="flex h-72 w-72 items-center justify-center rounded-3xl bg-primary/10 text-center">

              <div>
                <p className="text-5xl">
                  🛒
                </p>

                <p className="mt-4 font-semibold">
                  Smart Shopping
                </p>
              </div>

            </div>
          </div>


        </div>
      </div>
    </section>
  );
}