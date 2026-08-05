import { redirect } from "next/navigation";

import { getApprovedSellerStore } from "@/lib/seller";

export default async function SellerProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const seller = await getApprovedSellerStore();
  if (seller.error === "UNAUTHENTICATED") redirect("/login");
  if (seller.error) redirect("/seller");
  return children;
}
