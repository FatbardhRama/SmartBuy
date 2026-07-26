import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <div className="rounded-2xl bg-primary/10 p-8 text-center md:p-12">

          <h2 className="text-3xl font-bold">
            Stay Updated with SmartBuy
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Subscribe to receive the latest deals,
            product updates, and exclusive offers.
          </p>

          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">

            <Input
              placeholder="Enter your email"
            />

            <Button>
              Subscribe
            </Button>

          </div>

        </div>

      </div>
    </section>
  );
}