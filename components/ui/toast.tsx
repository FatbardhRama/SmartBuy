"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

export type ToastTone = "success" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };
let toastStore: ToastItem[] = [];
let nextToastId = 0;
const listeners = new Set<() => void>();

function notify(message: string, tone: ToastTone) {
  toastStore = [...toastStore, { id: ++nextToastId, message, tone }].slice(-4);
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
    return () => { listeners.delete(listener); };
  }, []);
  return { toasts, dismissToast };
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) => window.setTimeout(() => dismissToast(toast.id), 4000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismissToast]);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-4 top-20 z-50 flex flex-col items-end gap-3 sm:left-auto sm:w-96" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = toast.tone === "success" ? CheckCircle2 : CircleAlert;
        return <div key={toast.id} role={toast.tone === "error" ? "alert" : "status"} aria-live={toast.tone === "error" ? "assertive" : "polite"} className={`flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-sm shadow-[0_20px_55px_-25px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 ${toast.tone === "success" ? "border-success/30" : "border-destructive/30"}`}><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${toast.tone === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}><Icon className="size-5" aria-hidden="true" /></span><p className="min-w-0 flex-1 pt-1.5 leading-5 text-foreground">{toast.message}</p><button type="button" onClick={() => dismissToast(toast.id)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Dismiss notification"><X className="size-4" aria-hidden="true" /></button></div>;
      })}
    </div>
  );
}

export function toastSuccess(message: string) { notify(message, "success"); }
export function toastError(message: string) { notify(message, "error"); }
