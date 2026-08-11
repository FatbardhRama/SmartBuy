"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";

import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toastSuccess } from "@/components/ui/toast";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CartPage() {
  const {
    cart,
    loaded,
    itemCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
  } = useCart();

  function handleRemove(productId: string, productName: string) {
    removeFromCart(productId);
    toastSuccess(`${productName} removed from your cart.`);
  }

  function handleClearCart() {
    clearCart();
    toastSuccess("Your cart has been cleared.");
  }

  if (!loaded) return <CartSkeleton />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-dashed border-primary/20 bg-card p-8 text-center shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/6" />
          <span className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="size-8" />
          </span>
          <h1 className="relative mt-6 text-3xl font-bold tracking-[-0.035em]">Your cart is ready for something great</h1>
          <p className="relative mx-auto mt-3 max-w-sm leading-6 text-muted-foreground">Explore SmartBuy electronics and add the devices and accessories you need.</p>
          <Link href="/products"><Button size="lg" className="relative mt-7 gap-2 rounded-xl">Continue shopping <ArrowRight className="size-4" /></Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sb-eyebrow">Your selection</p>
          <h1 className="sb-heading-xl">Shopping cart</h1>
          <p className="mt-2 text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>
        </div>
        <Button variant="ghost" className="self-start rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-auto" onClick={handleClearCart}>
          <Trash2 className="size-4" /> Clear cart
        </Button>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          {cart.map((product) => (
            <Card key={product.id} className="gap-0 overflow-hidden rounded-[1.5rem] border-0 py-0 ring-1 ring-border/80 transition-shadow duration-300 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:hover:shadow-[0_24px_54px_-38px_rgba(37,99,235,0.3)]">
              <CardContent className="grid gap-5 p-4 sm:grid-cols-[152px_minmax(0,1fr)_auto] sm:p-5">
                <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_10%,#FFFFFF_0%,#EFF6FF_55%,#DCE8F5_100%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20 sm:aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 152px" />
                </Link>

                <div className="flex min-w-0 flex-col">
                  <Link href={`/products/${product.id}`} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"><h2 className="line-clamp-2 text-lg font-semibold tracking-tight sm:text-xl">{product.name}</h2></Link>
                  <p className="mt-1 font-semibold text-foreground">{formatCurrency(product.price)} <span className="text-xs font-normal text-muted-foreground">each</span></p>
                  <p className="mt-2 text-xs text-muted-foreground">{product.stock} currently available</p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-xl bg-background ring-1 ring-border" aria-label={`Quantity for ${product.name}`}>
                      <Button variant="ghost" size="icon-sm" onClick={() => decreaseQuantity(product.id)} disabled={product.quantity <= 1} aria-label="Decrease quantity"><Minus className="size-4" /></Button>
                      <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">{product.quantity}</span>
                      <Button variant="ghost" size="icon-sm" onClick={() => increaseQuantity(product.id)} disabled={product.quantity >= product.stock} aria-label="Increase quantity"><Plus className="size-4" /></Button>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:bg-destructive/8 hover:text-destructive" onClick={() => handleRemove(product.id, product.name)}>
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-border/70 pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <span className="text-xs text-muted-foreground sm:text-right">Item total</span>
                  <p className="text-lg font-bold">{formatCurrency(product.price * product.quantity)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit overflow-hidden rounded-[1.5rem] border-0 bg-[#0f172a] text-slate-100 ring-1 ring-slate-800 shadow-[0_26px_56px_-34px_rgba(15,23,42,0.8)] lg:sticky lg:top-24">
          <CardHeader className="border-b border-white/10 pb-5"><CardTitle className="text-xl tracking-tight text-white">Order summary</CardTitle></CardHeader>
          <CardContent className="space-y-5 pt-1">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span>Items ({itemCount})</span><span className="text-slate-200">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="font-medium text-slate-200">Calculated at checkout</span></div>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-5"><span className="font-semibold text-white">Total</span><span className="text-2xl font-bold tracking-[-0.03em] text-white">{formatCurrency(subtotal)}</span></div>
            <Link href="/checkout" className="block"><Button size="lg" className="h-12 w-full gap-2 rounded-xl">Proceed to checkout <ArrowRight className="size-4" /></Button></Link>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck className="size-4 text-cyan-300" /> Secure payment powered by Stripe</p>
            <Link href="/products" className="block rounded-md text-center text-sm font-medium text-cyan-200 hover:text-cyan-100 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/20">Continue shopping</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
