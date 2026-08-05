import { SellerProductForm } from "@/components/seller/SellerProductForm";
import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditSellerProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="mx-auto max-w-3xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-10"><Link href="/seller/products" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" aria-hidden="true" /> Back to products</Link><Card className="border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] ring-1 ring-border"><CardHeader className="border-b border-border"><div className="flex items-start gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><PencilLine className="size-5" aria-hidden="true" /></span><div><CardTitle className="text-2xl tracking-[-0.03em]">Edit product</CardTitle><CardDescription className="mt-1">Update listing information, pricing, imagery, and stock.</CardDescription></div></div></CardHeader><CardContent className="pt-6"><SellerProductForm productId={id} /></CardContent></Card></main>;
}
