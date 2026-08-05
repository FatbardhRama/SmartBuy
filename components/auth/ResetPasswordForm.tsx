"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage("Missing reset token");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unable to reset password");
        return;
      }

      setMessage("Password reset successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-6 w-full max-w-md rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
      <CardHeader className="items-center px-6 pb-3 pt-2 text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound className="size-5" aria-hidden="true" /></span>
        <CardTitle className="text-3xl font-bold tracking-[-0.035em]">Choose a new password</CardTitle>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Create a secure password for your SmartBuy account.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="h-11 rounded-xl bg-background" /></div>

          <Button className="h-11 w-full rounded-xl" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
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
