import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "tap-scale inline-flex items-center justify-center gap-1.5 rounded-2xl text-[13px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "bg-gold-gradient text-white shadow-press",
        ink: "bg-ink-gradient text-gold shadow-press",
        surface: "border border-border-soft bg-surface text-ink-soft shadow-card",
        ghost: "text-ink-soft",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-[12px]",
        icon: "h-11 w-11 shrink-0",
      },
    },
    defaultVariants: { variant: "surface", size: "default" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
