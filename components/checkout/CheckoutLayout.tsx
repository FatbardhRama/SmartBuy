"use client";

import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";

export type CheckoutData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

const initialForm: CheckoutData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

export function CheckoutLayout() {
  const [form, setForm] = useState<CheckoutData>(initialForm);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Secure checkout</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Complete your purchase</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Confirm your delivery details, review your order, and continue to Stripe&apos;s secure payment page.</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Checkout progress">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">1</span><span>Details</span><span className="h-px w-8 bg-border" /><span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">2</span><span>Payment</span><span className="h-px w-8 bg-border" /><span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">3</span><span>Confirmation</span>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <CheckoutForm form={form} setForm={setForm} />
        <OrderSummary form={form} />
      </div>
    </div>
  );
}
