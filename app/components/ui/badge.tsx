import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// shadcn/ui Badge, mapped onto the site's own color tokens.
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border font-mono text-[10px] uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground px-2 py-0.5 text-background",
        secondary: "border-transparent bg-subtle/60 px-1.5 py-0.5 text-muted",
        outline: "border-border px-2 py-0.5 text-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
