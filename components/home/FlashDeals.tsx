import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const deals = [
  {
    name: "Smartphone Pro",
    oldPrice: "$999",
    newPrice: "$799",
    discount: "20% OFF",
    icon: "📱",
  },
  {
    name: "Gaming Setup",
    oldPrice: "$1500",
    newPrice: "$1199",
    discount: "25% OFF",
    icon: "🎮",
  },
  {
    name: "Wireless Earbuds",
    oldPrice: "$199",
    newPrice: "$99",
    discount: "50% OFF",
    icon: "🎧",
  },
];

export function FlashDeals() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">

        <h2 className="mb-8 text-3xl font-bold">
          Flash Deals ⚡
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          {deals.map((deal) => (
            <Card key={deal.name}>

              <CardContent className="p-6 text-center">

                <div className="text-6xl">
                  {deal.icon}
                </div>

                <h3 className="mt-4 text-xl font-semibold">
                  {deal.name}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground line-through">
                  {deal.oldPrice}
                </p>

                <p className="text-2xl font-bold">
                  {deal.newPrice}
                </p>

                <p className="mt-2 font-semibold text-green-600">
                  {deal.discount}
                </p>

              </CardContent>

              <CardFooter>
                <Button className="w-full">
                  Grab Deal
                </Button>
              </CardFooter>

            </Card>
          ))}

        </div>

      </div>
    </section>
  );
}