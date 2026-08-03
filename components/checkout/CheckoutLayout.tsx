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
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-3xl font-bold sm:mb-8">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
