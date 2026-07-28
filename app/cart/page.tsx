"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  } = useCart();



  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading cart...
        </h1>
      </div>
    );
  }



  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );



  if (cart.length === 0) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>
      </div>
    );

  }



  return (

    <div className="min-h-screen p-6">


      <h1 className="text-3xl font-bold mb-6">
        Shopping Cart
      </h1>



      <div className="max-w-4xl space-y-5">


        {cart.map((product)=>(


          <Card key={product.id}>


            <CardHeader>

              <CardTitle>
                {product.name}
              </CardTitle>

            </CardHeader>



            <CardContent className="flex justify-between items-center">


              <div>


                <p>
                  Price: ${product.price}
                </p>



                <div className="flex items-center gap-3 mt-3">


                  <Button
                    variant="outline"
                    onClick={() =>
                      decreaseQuantity(product.id)
                    }
                  >
                    -
                  </Button>



                  <span className="text-lg font-bold">
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





              <Button
                variant="destructive"
                onClick={() =>
                  removeFromCart(product.id)
                }
              >
                Remove
              </Button>


            </CardContent>


          </Card>


        ))}






        <Card>


          <CardContent className="p-6">


            <h2 className="text-2xl font-bold">
              Total: ${total}
            </h2>



            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={clearCart}
            >
              Clear Cart
            </Button>



            <Button
              className="w-full mt-3"
            >
              Checkout
            </Button>



          </CardContent>


        </Card>



      </div>


    </div>

  );

}