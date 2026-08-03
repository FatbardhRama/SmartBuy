"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Heart } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { data: session } = useSession();

  const {
    itemCount,
    loaded,
  } = useCart();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">

        <Link
          href="/"
          className="text-2xl font-bold"
        >
          SmartBuy
        </Link>


        <nav className="flex items-center gap-6">

          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Products
          </Link>

          <Link href="/deals">
            Deals
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-1"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-1"
          >
            Cart

            {loaded && itemCount > 0 && (
              <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            )}

          </Link>

        </nav>


        <div className="flex items-center gap-3">

          <ThemeToggle />


          {session ? (

            <>

              <span className="text-sm">
                Hello, {session.user?.name}
              </span>


              <Link href="/profile">

                <Button variant="outline">
                  Profile
                </Button>

              </Link>


              <Link href="/orders">

                <Button variant="outline">
                  My Orders
                </Button>

              </Link>


              {session.user?.role === "ADMIN" && (

                <Link href="/admin">

                  <Button variant="outline">
                    Admin
                  </Button>

                </Link>

              )}


              <Button
                onClick={() => signOut()}
              >
                Logout
              </Button>


            </>


          ) : (

            <>

              <Link href="/login">

                <Button variant="outline">
                  Login
                </Button>

              </Link>


              <Link href="/register">

                <Button>
                  Register
                </Button>

              </Link>

            </>

          )}

        </div>

      </div>
    </header>
  );
}
