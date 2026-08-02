"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { SessionTimeoutProvider } from "@/components/providers/SessionTimeoutProvider";

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <SessionTimeoutProvider>
        {children}
      </SessionTimeoutProvider>
    </NextAuthProvider>
  );
}