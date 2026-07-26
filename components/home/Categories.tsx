import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Electronics",
    icon: "💻",
    description: "Smartphones, laptops and gadgets",
  },
  {
    name: "Fashion",
    icon: "👕",
    description: "Clothing and accessories",
  },
  {
    name: "Home",
    icon: "🏠",
    description: "Furniture and home essentials",
  },
  {
    name: "Beauty",
    icon: "💄",
    description: "Beauty and personal care",
  },
  {
    name: "Gaming",
    icon: "🎮",
    description: "Games and gaming equipment",
  },
];

export function Categories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <h2 className="mb-8 text-3xl font-bold">
          Shop by Category
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

          {categories.map((category) => (
            <Card
              key={category.name}
              className="cursor-pointer transition hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">

                <div className="mb-4 text-5xl">
                  {category.icon}
                </div>

                <h3 className="text-lg font-semibold">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>

              </CardContent>
            </Card>
          ))}

        </div>

      </div>
    </section>
  );
}