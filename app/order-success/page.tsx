import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, ReceiptText, ShoppingBag } from "lucide-react";

import { ClearCartAfterPayment } from "@/components/checkout/ClearCartAfterPayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

type OrderSuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const { session_id: sessionIdParam } = await searchParams;
  const sessionId = typeof sessionIdParam === "string" ? sessionIdParam : undefined;
  let paymentConfirmed = false;

  if (sessionId?.startsWith("cs_")) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      paymentConfirmed =
        checkoutSession.payment_status === "paid" &&
        checkoutSession.client_reference_id === session.user.id &&
        checkoutSession.metadata?.userId === session.user.id;
    } catch {
      paymentConfirmed = false;
    }
  }

  if (!paymentConfirmed) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
          <CardContent className="p-8 text-center sm:p-10">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-warning/10 text-warning"><AlertTriangle className="size-8" /></span>
            <h1 className="mt-6 text-3xl font-bold tracking-[-0.035em]">Payment confirmation unavailable</h1>
            <p className="mt-3 leading-6 text-muted-foreground">We could not verify this Stripe payment. Your cart has not been changed.</p>
            <Link href="/checkout"><Button className="mt-7 rounded-xl">Return to checkout</Button></Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-6 py-12">
      <ClearCartAfterPayment />
      <Card className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
        <CardContent className="p-8 text-center sm:p-12">
          <span className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-success/10 text-success"><CheckCircle2 className="size-10" /></span>
          <p className="mt-6 text-sm font-semibold text-primary">Payment confirmed</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Your order is confirmed</h1>
          <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">Thank you for your purchase. Your order has been received and is being processed.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/orders"><Button size="lg" className="w-full gap-2 rounded-xl"><ReceiptText className="size-5" /> View orders</Button></Link>
            <Link href="/products"><Button size="lg" variant="outline" className="w-full gap-2 rounded-xl"><ShoppingBag className="size-5" /> Continue shopping</Button></Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Your cart has been cleared safely after payment confirmation.</p>
        </CardContent>
      </Card>
    </main>
  );
}
