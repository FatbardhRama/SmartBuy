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
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative max-w-3xl">
        <p className="sb-eyebrow">Secure checkout</p>
        <h1 className="sb-heading-xl">Complete your purchase</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Confirm your delivery details, review your order, and continue to Stripe&apos;s secure payment page.</p>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Checkout progress">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">1</span><span>Details</span><span className="h-px w-8 bg-border" /><span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">2</span><span>Payment</span><span className="h-px w-8 bg-border" /><span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">3</span><span>Confirmation</span>
        </div>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <CheckoutForm form={form} setForm={setForm} />
        <OrderSummary form={form} />
      </div>
    </div>
  );
}
