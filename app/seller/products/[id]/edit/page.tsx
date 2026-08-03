import { SellerProductForm } from "@/components/seller/SellerProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditSellerProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10"><Card><CardHeader><CardTitle>Edit Product</CardTitle></CardHeader><CardContent><SellerProductForm productId={id} /></CardContent></Card></main>;
}
