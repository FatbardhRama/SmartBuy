"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export function ClearCartAfterPayment() {
  const { clearCart, loaded } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!loaded || hasCleared.current) {
      return;
    }

    hasCleared.current = true;
    clearCart();
  }, [clearCart, loaded]);

  return null;
}
