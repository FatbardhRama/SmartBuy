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
    <Link href={`/products/${id}`} className="group block h-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">

      <Card className="h-full cursor-pointer overflow-hidden transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">


        <div className="relative h-44 w-full sm:h-48">

          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />

        </div>



        <CardHeader className="pb-3">

          <CardTitle className="break-words text-lg">
            {name}
          </CardTitle>

        </CardHeader>




        <CardContent className="space-y-3">


          <p className="min-h-10 text-sm text-muted-foreground">
            {description}
          </p>



          <p className="text-lg font-bold">
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
