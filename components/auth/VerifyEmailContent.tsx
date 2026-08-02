"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
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

    if (token) {
      verifyEmail();
    } else {
      setMessage("Missing verification token");
    }
  }, [token]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p>{message}</p>
        <Link href="/login">
          <Button className="w-full">Go to login</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
