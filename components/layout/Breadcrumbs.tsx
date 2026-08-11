"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

type Breadcrumb = {
  href: string;
  label: string;
};

const hiddenPaths = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

const labels: Record<string, string> = {
  admin: "Admin",
  cart: "Cart",
  checkout: "Checkout",
  deals: "Deals",
  edit: "Edit Product",
  new: "Add Product",
  orders: "My Orders",
  "order-success": "Order Confirmed",
  products: "Products",
  profile: "My Profile",
  wishlist: "Wishlist",
};

function getLabel(segment: string, index: number, segments: string[]) {
  if (labels[segment]) {
    return labels[segment];
  }

  const parent = segments[index - 1];
  if (parent === "products") {
    return "Product Details";
  }

  if (parent === "orders") {
    return "Order Details";
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || hiddenPaths.has(pathname) || pathname.startsWith("/api/")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [
    { href: "/", label: "Home" },
    ...segments.map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label: getLabel(segment, index, segments),
    })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6"
    >
      <ol className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <li key={breadcrumb.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />
              )}

              {isCurrent ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link href={breadcrumb.href} className="transition-colors hover:text-foreground">
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
