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
    return <Skeleton className="h-[460px] w-full rounded-[1.5rem]" />;
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
    <Card className="overflow-hidden rounded-[1.5rem] border-0 bg-[#0f172a] text-slate-100 ring-1 ring-slate-800 shadow-[0_26px_56px_-34px_rgba(15,23,42,0.8)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 lg:sticky lg:top-24">
      <CardHeader className="border-b border-border/70 pb-5">
        <CardTitle className="text-xl tracking-tight text-white">Order summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {cart.length === 0 ? (
          <div className="rounded-xl bg-white/8 p-5 text-center"><p className="text-sm font-medium text-white">Your shopping cart is empty.</p><p className="mt-1 text-xs text-slate-400">Add a product before continuing to payment.</p></div>
        ) : (
          <>
            <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-white/6 p-2"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      Qty {item.quantity}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-white/10" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  Subtotal
                </span>

                <span>
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-4 text-lg font-semibold">
                <span className="font-semibold text-white">
                  Total
                </span>

                <span className="text-2xl font-bold tracking-[-0.03em] text-white">
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
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
          <p className="flex items-center gap-2"><LockKeyhole className="size-4 text-cyan-300" /> Payment details are handled securely by Stripe.</p>
          <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan-300" /> Prices and stock are verified before payment.</p>
        </div>
      </CardContent>
    </Card>
  );
}
