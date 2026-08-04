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
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Secure checkout</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Complete your purchase</h1>
        <p className="mt-3 text-muted-foreground">Confirm your delivery details before continuing to Stripe&apos;s secure payment page.</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <CheckoutForm
            form={form}
            setForm={setForm}
          />
        </div>

        <div>
          <OrderSummary form={form} />
        </div>
      </div>
    </div>
  );
}
