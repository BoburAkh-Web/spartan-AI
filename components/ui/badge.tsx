import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide",
  {
    variants: {
      variant: {
        gold: "bg-gold-gradient text-white",
        ink: "bg-ink text-gold",
        green: "bg-green-soft text-green",
        crimson: "bg-crimson-soft text-crimson",
        muted: "bg-ink/5 text-ink-soft",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
