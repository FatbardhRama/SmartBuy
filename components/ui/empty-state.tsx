import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-primary/20 bg-card p-8 text-center shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)] ring-1 ring-white/80 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 sm:p-12 dark:ring-white/5",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/6" />
      <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
        {icon}
      </div>

      <h2 className="relative mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h2>

      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}
