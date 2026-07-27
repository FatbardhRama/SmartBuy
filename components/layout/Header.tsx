"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

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

        </nav>


        <div className="flex items-center gap-3">

          <ThemeToggle />


          {session ? (
            <>
              <span className="text-sm">
                Hello, {session.user?.name}
              </span>

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