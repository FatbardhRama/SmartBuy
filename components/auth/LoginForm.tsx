"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-6 w-full max-w-md rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
      <CardHeader className="items-center px-6 pb-3 pt-2 text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LogIn className="size-5" aria-hidden="true" /></span>
        <CardTitle className="text-3xl font-bold tracking-[-0.035em]">Welcome back</CardTitle>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Sign in to manage your orders, wishlist, and SmartBuy account.</p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2"><Label htmlFor="login-email">Email address</Label><Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="h-11 rounded-xl bg-background" /></div>
          <div className="space-y-2"><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="h-11 rounded-xl bg-background" /></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
              />

              <label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="rounded-md text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            className="h-11 w-full rounded-xl"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          {message && (
            <p className="rounded-xl bg-destructive/8 p-3 text-center text-sm text-destructive" role="alert">
              {message}
            </p>
          )}
          <p className="flex items-center justify-center gap-2 border-t border-border/70 pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-success" aria-hidden="true" /> Your account is protected by secure authentication.</p>
        </form>
      </CardContent>
    </Card>
  );
}
