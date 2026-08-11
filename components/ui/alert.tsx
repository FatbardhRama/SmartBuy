import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm shadow-xs",
      className
    )}
    {...props}
  />
));

Alert.displayName = "Alert";


const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-6 text-muted-foreground",
      className
    )}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";


export {
  Alert,
  AlertDescription,
};
