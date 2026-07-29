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
    <Card>
      <CardHeader>
        <CardTitle>
          Customer Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
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

          <div className="space-y-2">
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

          <h2 className="text-lg font-semibold">
            Shipping Address
          </h2>

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

          <div className="grid gap-4 md:grid-cols-2">
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