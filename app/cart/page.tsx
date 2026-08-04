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
        <div className="w-full max-w-lg rounded-3xl border border-dashed bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="size-8" />
          </span>
          <h1 className="mt-6 text-3xl font-bold">Your cart is ready for something great</h1>
          <p className="mx-auto mt-3 max-w-sm leading-6 text-muted-foreground">Explore SmartBuy electronics and add the devices and accessories you need.</p>
          <Link href="/products"><Button size="lg" className="mt-7 gap-2">Continue shopping <ArrowRight className="size-4" /></Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Your selection</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Shopping cart</h1>
          <p className="mt-2 text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>
        </div>
        <Button variant="ghost" className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-auto" onClick={handleClearCart}>
          <Trash2 className="size-4" /> Clear cart
        </Button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {cart.map((product) => (
            <Card key={product.id} className="gap-0 overflow-hidden py-0 motion-safe:animate-in motion-safe:fade-in-0">
              <CardContent className="grid gap-5 p-4 sm:grid-cols-[144px_minmax(0,1fr)_auto] sm:p-5">
                <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 144px" />
                </Link>

                <div className="flex min-w-0 flex-col">
                  <Link href={`/products/${product.id}`} className="hover:text-primary"><h2 className="line-clamp-2 text-lg font-semibold sm:text-xl">{product.name}</h2></Link>
                  <p className="mt-1 font-semibold text-primary">{formatCurrency(product.price)}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Maximum available: {product.stock}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-lg border bg-background shadow-xs" aria-label={`Quantity for ${product.name}`}>
                      <Button variant="ghost" size="icon-sm" onClick={() => decreaseQuantity(product.id)} disabled={product.quantity <= 1} aria-label="Decrease quantity"><Minus className="size-4" /></Button>
                      <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">{product.quantity}</span>
                      <Button variant="ghost" size="icon-sm" onClick={() => increaseQuantity(product.id)} disabled={product.quantity >= product.stock} aria-label="Increase quantity"><Plus className="size-4" /></Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemove(product.id, product.name)}>
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <span className="text-xs text-muted-foreground sm:text-right">Item total</span>
                  <p className="text-lg font-bold">{formatCurrency(product.price * product.quantity)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader><CardTitle className="text-xl">Order summary</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Items ({itemCount})</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="font-medium text-foreground">Calculated at checkout</span></div>
            </div>
            <div className="flex items-end justify-between border-t pt-5"><span className="font-semibold">Total</span><span className="text-2xl font-bold text-primary">{formatCurrency(subtotal)}</span></div>
            <Link href="/checkout" className="block"><Button size="lg" className="w-full gap-2">Proceed to checkout <ArrowRight className="size-4" /></Button></Link>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Secure payment powered by Stripe</p>
            <Link href="/products" className="block text-center text-sm font-medium text-primary hover:underline">Continue shopping</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
