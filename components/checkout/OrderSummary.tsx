"use client";

import Image from "next/image";
import { useState } from "react";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { toastError } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { CheckoutData } from "./CheckoutLayout";

type OrderSummaryProps = {
  form: CheckoutData;
};

export function OrderSummary({
  form,
}: OrderSummaryProps) {
  const {
    cart,
    loaded,
    subtotal,
  } = useCart();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loaded) {
    return <Skeleton className="h-[460px] w-full rounded-2xl" />;
  }

  const shipping = 0;
  const total = subtotal + shipping;

  async function handleCheckout() {
    if (loading) {
      return;
    }

    setError("");

    const hasEmptyField = Object.values(form).some(
      (value) => value.trim() === ""
    );

    if (hasEmptyField) {
      const message = "Please fill in all required fields.";
      setError(message);
      toastError(message);
      return;
    }

    if (cart.length === 0) {
      const message = "Your shopping cart is empty.";
      setError(message);
      toastError(message);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/stripe/create-checkout-session", {
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

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data === "object" && data !== null && "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "We could not start Stripe Checkout right now.";
        throw new Error(message);
      }

      const url =
        typeof data === "object" && data !== null && "url" in data
          ? (data as { url?: unknown }).url
          : null;

      if (typeof url !== "string" || !url.startsWith("https://")) {
        throw new Error("Stripe Checkout returned an invalid redirect URL.");
      }

      window.location.assign(url);
    } catch (checkoutError) {
      const message = checkoutError instanceof Error
        ? checkoutError.message
        : "Something went wrong while starting Stripe Checkout.";
      setError(message);
      toastError(message);
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl border-0 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] ring-1 ring-border/80 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 lg:sticky lg:top-24">
      <CardHeader className="border-b border-border/70 pb-5">
        <CardTitle className="text-xl tracking-tight">Order summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {cart.length === 0 ? (
          <div className="rounded-xl bg-muted/45 p-5 text-center"><p className="text-sm font-medium">Your shopping cart is empty.</p><p className="mt-1 text-xs text-muted-foreground">Add a product before continuing to payment.</p></div>
        ) : (
          <>
            <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-muted/25 p-2"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-border/70" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Subtotal
                </span>

                <span>
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>
              </div>

              <div className="flex items-end justify-between border-t border-border/70 pt-4 text-lg font-semibold">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold tracking-[-0.03em]">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          size="lg"
          className="h-12 w-full gap-2 rounded-xl"
          disabled={
            cart.length === 0 || loading
          }
          onClick={handleCheckout}
        >
          {loading ? "Redirecting to Stripe..." : <><CreditCard className="size-5" /> Pay securely with Stripe</>}
        </Button>
        <div className="space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><LockKeyhole className="size-4 text-success" /> Payment details are handled securely by Stripe.</p>
          <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Prices and stock are verified before payment.</p>
        </div>
      </CardContent>
    </Card>
  );
}
