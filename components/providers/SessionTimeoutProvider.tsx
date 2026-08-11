"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

const TIMEOUT_DURATION = 15 * 60 * 1000;

export function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        signOut({
          callbackUrl: "/login",
        });
      }, TIMEOUT_DURATION);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session]);

  return children;
}