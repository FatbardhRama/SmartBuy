import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";


type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};


export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
}: ProductProps) {


  const formattedPrice = formatCurrency(price);



  return (
    <Link href={`/products/${id}`}>

      <Card className="overflow-hidden cursor-pointer transition hover:scale-[1.02]">


        <div className="relative h-48 w-full">

          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />

        </div>



        <CardHeader>

          <CardTitle>
            {name}
          </CardTitle>

        </CardHeader>




        <CardContent>


          <p className="text-sm text-muted-foreground">
            {description}
          </p>



          <p className="mt-3 text-lg font-bold">
            {formattedPrice}
          </p>



          <p className="text-sm text-muted-foreground">
            {category}
          </p>


        </CardContent>


      </Card>

    </Link>
  );
}