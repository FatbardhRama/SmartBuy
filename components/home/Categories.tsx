import Link from "next/link";
import { Gamepad2, Headphones, Keyboard, Laptop, Monitor, Smartphone, Watch, Wifi } from "lucide-react";

const categories = [
  { name: "Laptops", icon: Laptop, description: "Portable performance for work and play", className: "lg:col-span-6" },
  { name: "Smartphones", icon: Smartphone, description: "Powerful phones for every lifestyle", className: "lg:col-span-3" },
  { name: "Gaming", icon: Gamepad2, description: "Responsive gear for console and PC", className: "lg:col-span-3" },
  { name: "Audio", icon: Headphones, description: "Immersive sound wherever you listen", className: "lg:col-span-3" },
  { name: "Accessories", icon: Keyboard, description: "Essentials for a better setup", className: "lg:col-span-3" },
  { name: "Wearables", icon: Watch, description: "Health, fitness, and notifications", className: "lg:col-span-2" },
  { name: "Smart Home", icon: Wifi, description: "Connected devices for daily life", className: "lg:col-span-2" },
  { name: "Monitors", icon: Monitor, description: "Crisp displays for focused work", className: "lg:col-span-2" },
];

export function Categories() {
  return (
    <section className="relative z-10 pb-18 pt-10 sm:pb-24 sm:pt-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="sb-eyebrow">Shop by category</p>
          <h2 className="sb-heading-lg">Find the right tech, faster</h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Go straight to the devices and accessories that fit your setup, studies, work, and downtime.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`} className={`group flex min-h-44 flex-col justify-between rounded-2xl p-5 sb-surface sb-surface-hover ${category.className} ${index === 0 ? "border-primary/15 bg-[linear-gradient(135deg,#FFFFFF_10%,#EFF6FF_100%)] dark:bg-[linear-gradient(135deg,#1D2D46_0%,#172033_100%)]" : ""}`}>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold tracking-tight">{category.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
