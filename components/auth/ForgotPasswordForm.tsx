"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unable to process request");
        return;
      }

      setMessage(data.message || "If an account exists, instructions have been sent.");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-6 w-full max-w-md rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
      <CardHeader className="items-center px-6 pb-3 pt-2 text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Mail className="size-5" aria-hidden="true" /></span>
        <CardTitle className="text-3xl font-bold tracking-[-0.035em]">Reset your password</CardTitle>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Enter your account email and we&apos;ll send instructions if a matching account exists.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="recovery-email">Email address</Label><Input id="recovery-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="h-11 rounded-xl bg-background" /></div>

          <Button className="h-11 w-full rounded-xl" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          {message && <p className="rounded-xl bg-muted/60 p-3 text-center text-sm" role="status">{message}</p>}

          <p className="text-center text-sm">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-md font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
