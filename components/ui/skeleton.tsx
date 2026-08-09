import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-gradient-to-r from-muted via-slate-200/80 to-muted motion-reduce:animate-none dark:via-slate-700/50", className)}
      {...props}
    />
  );
}

export { Skeleton };
