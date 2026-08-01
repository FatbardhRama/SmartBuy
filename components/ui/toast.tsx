"use client";

import { useEffect, useState } from "react";

export type ToastTone = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

let toastStore: ToastItem[] = [];
const listeners = new Set<() => void>();

function notify(message: string, tone: ToastTone) {
  const item = { id: Date.now(), message, tone };
  toastStore = [...toastStore, item];
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: number) {
  toastStore = toastStore.filter((toast) => toast.id !== id);
  listeners.forEach((listener) => listener());
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastStore);

  useEffect(() => {
    const listener = () => setToasts([...toastStore]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    dismissToast,
  };
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 3000)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dismissToast, toasts]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50 flex w-[min(92vw,24rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.tone === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function toastSuccess(message: string) {
  notify(message, "success");
}

export function toastError(message: string) {
  notify(message, "error");
}
