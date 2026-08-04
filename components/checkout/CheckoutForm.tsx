"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutData } from "./CheckoutLayout";

type CheckoutFormProps = {
  form: CheckoutData;
  setForm: React.Dispatch<
    React.SetStateAction<CheckoutData>
  >;
};

export function CheckoutForm({
  form,
  setForm,
}: CheckoutFormProps) {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
          <div><CardTitle className="text-xl">Contact information</CardTitle><p className="mt-1 text-sm text-muted-foreground">We&apos;ll use these details for delivery updates.</p></div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <form className="space-y-7">
          <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name
            </Label>

            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phone">
              Phone
            </Label>

            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+355..."
            />
          </div>
          </div>

          <div className="flex items-start gap-3 border-t pt-7">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
            <div><h2 className="text-lg font-semibold">Shipping address</h2><p className="mt-1 text-sm text-muted-foreground">Where should we deliver your order?</p></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address
            </Label>

            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">
                City
              </Label>

              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Tirana"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Postal Code
              </Label>

              <Input
                id="postalCode"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="1001"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
