import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border border-input/90 bg-card px-3 py-2.5 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
