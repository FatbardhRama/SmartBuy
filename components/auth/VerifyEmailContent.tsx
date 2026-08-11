"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [message, setMessage] = useState(
    token ? "Verifying your email..." : "Missing verification token"
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Unable to verify your email");
          return;
        }

        setMessage(data.message || "Email verified successfully");
      } catch {
        setMessage("Something went wrong while verifying your email");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <Card className="mx-6 w-full max-w-md rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
      <CardHeader className="items-center px-6 pb-3 pt-2 text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{message.toLowerCase().includes("success") ? <BadgeCheck className="size-5" aria-hidden="true" /> : <MailCheck className="size-5" aria-hidden="true" />}</span>
        <CardTitle className="text-3xl font-bold tracking-[-0.035em]">Email verification</CardTitle>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Confirming your email keeps your SmartBuy account secure.</p>
      </CardHeader>
      <CardContent className="space-y-5 text-center">
        <p className="rounded-xl bg-muted/60 p-3 text-sm" role="status">{message}</p>
        <Link href="/login">
          <Button className="h-11 w-full rounded-xl">Go to sign in</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
