import Link from "next/link";
import { Gamepad2, Headphones, Keyboard, Laptop, Monitor, Smartphone, Watch, Wifi } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Laptops", icon: Laptop, description: "Portable performance for work and play" },
  { name: "Smartphones", icon: Smartphone, description: "Powerful phones for every lifestyle" },
  { name: "Gaming", icon: Gamepad2, description: "Responsive gear for console and PC players" },
  { name: "Audio", icon: Headphones, description: "Immersive sound at home or on the go" },
  { name: "Accessories", icon: Keyboard, description: "Keyboards, mice and everyday tech essentials" },
  { name: "Wearables", icon: Watch, description: "Connected health, fitness and notifications" },
  { name: "Smart Home", icon: Wifi, description: "Connected devices for a smarter living space" },
  { name: "Monitors", icon: Monitor, description: "Crisp displays for productive setups" },
];

export function Categories() {
  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Find your next upgrade</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Top categories</h2>
          <p className="mt-3 text-muted-foreground">Find the devices and accessories that fit your setup, workflow, and lifestyle.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`} className="group">
                <Card className="h-full transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <span className="mb-8 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
