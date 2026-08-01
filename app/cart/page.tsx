"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { useCart } from "@/context/CartContext";



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

    return (
      <div className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl font-bold">
          Loading cart...
        </h1>

      </div>
    );

  }





  if (cart.length === 0) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>

      </div>

    );

  }






  return (

    <div className="container mx-auto px-6 py-10">


      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>




      <div className="grid gap-8 lg:grid-cols-3">





        <div className="space-y-5 lg:col-span-2">



          {cart.map((product) => (


            <Card key={product.id}>


              <CardContent className="flex gap-5 p-6">



                <div className="relative h-32 w-32 overflow-hidden rounded-lg">


                  <Image

                    src={product.image}

                    alt={product.name}

                    fill

                    className="object-cover"

                  />


                </div>






                <div className="flex flex-1 flex-col justify-between">


                  <div>


                    <h2 className="text-xl font-bold">
                      {product.name}
                    </h2>



                    <p className="text-muted-foreground">
                      ${product.price}
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







                <div className="flex flex-col items-end justify-between">


                  <p className="font-bold">

                    ${(product.price * product.quantity).toFixed(2)}

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








        <Card className="h-fit">


          <CardContent className="space-y-5 p-6">


            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>




            <div className="flex justify-between">

              <span>
                Subtotal
              </span>


              <span className="font-bold">

                ${subtotal.toFixed(2)}

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