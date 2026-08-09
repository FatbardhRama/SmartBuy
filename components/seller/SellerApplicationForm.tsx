"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, LoaderCircle, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/components/ui/toast";

export function SellerApplicationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/seller/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message ?? "Unable to submit your store application.";
        setError(message);
        toastError(message);
        return;
      }

      toastSuccess("Your store application was submitted successfully.");
      router.refresh();
    } catch {
      const message = "Unable to submit your store application.";
      setError(message);
      toastError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl overflow-hidden rounded-[1.5rem] border-0 sb-surface">
      <CardHeader className="border-b border-border/70">
        <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="size-5" aria-hidden="true" /></div>
        <CardTitle className="text-2xl tracking-[-0.03em]">Open your store</CardTitle>
        <CardDescription>
          Tell us about your store. An administrator will review your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-3 rounded-xl bg-primary/[0.06] p-4 ring-1 ring-primary/10"><Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><p className="font-semibold">Application status: Pending</p><p className="mt-1 text-sm leading-6 text-muted-foreground">After you submit, SmartBuy creates your store application for admin review before product management becomes available.</p></div></div>
          <div className="space-y-2">
            <Label htmlFor="store-name">Store name</Label>
            <Input className="h-12 rounded-xl bg-background/75"
              id="store-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your store name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-description">Description</Label>
            <Textarea className="min-h-32 rounded-xl bg-background/75"
              id="store-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What will your store sell?"
              required
            />
          </div>

          {error && <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p>}

          <Button type="submit" disabled={submitting} className="h-11 rounded-xl">
            {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}{submitting ? "Submitting..." : "Submit application"}{!submitting ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
