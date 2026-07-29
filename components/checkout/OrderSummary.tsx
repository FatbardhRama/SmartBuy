"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCart } from "@/context/CartContext";
import type { CheckoutData } from "./CheckoutLayout";

type OrderSummaryProps = {
  form: CheckoutData;
};

export function OrderSummary({
  form,
}: OrderSummaryProps) {
  const router = useRouter();

  const {
    cart,
    loaded,
    subtotal,
    clearCart,
  } = useCart();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loaded) {
    return null;
  }

  const shipping = 0;
  const total = subtotal + shipping;

  async function handleOrder() {
    setError("");

    const hasEmptyField = Object.values(form).some(
      (value) => value.trim() === ""
    );

    if (hasEmptyField) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (cart.length === 0) {
      setError(
        "Your shopping cart is empty."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create order."
        );
      }

      clearCart();

      router.push("/order-success");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your shopping cart is empty.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="font-medium">
                    €
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>
              </div>

              <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>
                  Total
                </span>

                <span>
                  €{total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          className="w-full"
          disabled={
            cart.length === 0 || loading
          }
          onClick={handleOrder}
        >
          {loading
            ? "Processing..."
            : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  );
}