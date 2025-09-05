"use client";

import { cn } from "@/lib/utils/cn";

type Variant = "default" | "secondary" | "outline" | "destructive";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default:
    "bg-muted text-muted-foreground",
  secondary:
    "bg-secondary text-secondary-foreground border border-secondary/40",
  outline:
    "bg-transparent text-foreground border",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/30",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}