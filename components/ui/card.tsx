import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-soft bg-surface p-4 shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardElevated({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border-soft bg-surface p-5 shadow-elevated",
        className,
      )}
      {...props}
    />
  );
}
