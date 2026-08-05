"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Account created successfully!");

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
        <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserPlus className="size-5" aria-hidden="true" /></span>
        <CardTitle className="text-3xl font-bold tracking-[-0.035em]">Create your account</CardTitle>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Save products, track orders, and shop from approved electronics sellers.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="register-name">Full name</Label><Input id="register-name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-11 rounded-xl bg-background" /></div>
          <div className="space-y-2"><Label htmlFor="register-email">Email address</Label><Input id="register-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="h-11 rounded-xl bg-background" /></div>
          <div className="space-y-2"><Label htmlFor="register-password">Password</Label><Input id="register-password" type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="h-11 rounded-xl bg-background" /><p className="text-xs leading-5 text-muted-foreground">Use the password requirements provided by SmartBuy validation.</p></div>

          <Button
            className="h-11 w-full rounded-xl"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          {message && (
            <p className="rounded-xl bg-muted/60 p-3 text-center text-sm" role="status">
              {message}
            </p>
          )}

          <p className="flex items-center justify-center gap-2 border-t border-border/70 pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-success" aria-hidden="true" /> Secure account creation and email verification.</p>
        </form>
      </CardContent>
    </Card>
  );
}
