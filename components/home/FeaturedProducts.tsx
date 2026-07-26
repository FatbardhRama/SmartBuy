import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const products = [
  {
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: "$999",
    image: "📱",
  },
  {
    name: "Gaming Laptop",
    category: "Gaming",
    price: "$1299",
    image: "💻",
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    price: "$199",
    image: "⌚",
  },
  {
    name: "Wireless Headphones",
    category: "Audio",
    price: "$149",
    image: "🎧",
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <h2 className="mb-8 text-3xl font-bold">
          Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <Card
              key={product.name}
              className="overflow-hidden"
            >

              <CardContent className="p-6 text-center">

                <div className="mb-4 text-6xl">
                  {product.image}
                </div>

                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>

                <p className="mt-3 text-xl font-bold">
                  {product.price}
                </p>

              </CardContent>

              <CardFooter>
                <Button className="w-full">
                  View Product
                </Button>
              </CardFooter>

            </Card>
          ))}

        </div>

      </div>
    </section>
  );
}