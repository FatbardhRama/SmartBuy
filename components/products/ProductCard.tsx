import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};


export function ProductCard({
  name,
  description,
  price,
  image,
  category,
}: ProductProps) {

  return (
    <Card className="overflow-hidden">

      <img
        src={image}
        alt={name}
        className="h-48 w-full object-cover"
      />

      <CardHeader>
        <CardTitle>
          {name}
        </CardTitle>
      </CardHeader>


      <CardContent>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>


        <p className="mt-3 font-bold">
          ${price}
        </p>


        <p className="text-sm">
          {category}
        </p>

      </CardContent>

    </Card>
  );
}