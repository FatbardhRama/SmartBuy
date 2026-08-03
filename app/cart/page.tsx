"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { CartSkeleton } from "@/components/cart/CartSkeleton";



export default function CartPage() {


  const {
    cart,
    loaded,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
  } = useCart();





  if (!loaded) {
    return <CartSkeleton />;

  }





  if (cart.length === 0) {

    return (

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md rounded-lg border border-dashed p-6 text-center sm:p-8">
          <h1 className="text-3xl font-bold">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add a few products to get started.
          </p>
          <Link href="/products">
            <Button className="mt-6">Start shopping</Button>
          </Link>
        </div>
      </div>

    );

  }






  return (

    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">


      <h1 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">
        Shopping Cart
      </h1>




      <div className="grid gap-8 lg:grid-cols-3">





        <div className="space-y-5 lg:col-span-2">



          {cart.map((product) => (


            <Card key={product.id} className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">


              <CardContent className="flex flex-col gap-5 p-4 sm:flex-row sm:p-6">



                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">


                  <Image

                    src={product.image}

                    alt={product.name}

                    fill

                    className="object-cover"

                  />


                </div>






                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">


                  <div>


                    <h2 className="break-words text-xl font-bold">
                      {product.name}
                    </h2>



                    <p className="text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>


                  </div>






                  <div className="flex items-center gap-3">


                    <Button

                      variant="outline"

                      onClick={() =>
                        decreaseQuantity(product.id)
                      }

                    >
                      -
                    </Button>




                    <span className="font-bold">
                      {product.quantity}
                    </span>




                    <Button

                      variant="outline"

                      onClick={() =>
                        increaseQuantity(product.id)
                      }

                    >
                      +
                    </Button>




                  </div>




                </div>







                <div className="flex items-center justify-between gap-4 sm:ml-auto sm:flex-col sm:items-end">


                  <p className="font-bold">
                    {formatCurrency(product.price * product.quantity)}
                  </p>




                  <Button

                    variant="destructive"

                    onClick={() =>
                      removeFromCart(product.id)
                    }

                  >
                    Remove
                  </Button>



                </div>



              </CardContent>


            </Card>


          ))}



        </div>








        <Card className="h-fit motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">


          <CardContent className="space-y-5 p-4 sm:p-6">


            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>




            <div className="flex justify-between">

              <span>
                Subtotal
              </span>


              <span className="font-bold">
                {formatCurrency(subtotal)}
              </span>


            </div>





            <Link href="/checkout">
  <Button
    className="w-full"
  >
    Checkout
  </Button>
</Link>





            <Button

              variant="destructive"

              className="w-full"

              onClick={clearCart}

            >

              Clear Cart

            </Button>



          </CardContent>


        </Card>



      </div>



    </div>

  );

}
