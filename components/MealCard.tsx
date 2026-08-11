"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { PlannedMeal, Recipe } from "@/types";
import { calcRecipe, extrasTotals, addTotals } from "@/lib/calc";
import { t } from "@/lib/i18n";
import { FoodIcon } from "./FoodIcon";

type Props = {
  meal: PlannedMeal;
  recipe: Recipe;
  time?: string;
  checked: boolean;
  onToggle: () => void;
  delay?: number;
};

export function MealCard({
  meal,
  recipe,
  time,
  checked,
  onToggle,
  delay = 0,
}: Props) {
  const base = calcRecipe(recipe, meal.portionScale ?? 1).totals;
  const totals = addTotals(base, extrasTotals(meal.extras));

  return (
    <div
      className={`animate-pop-in flex items-stretch gap-3 rounded-2xl border p-3 transition-all duration-300 ${
        checked
          ? "border-green/25 bg-green-soft shadow-card"
          : "border-border-soft bg-surface shadow-card"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={checked ? "Belgilangan" : "Belgilanmagan"}
        className={`tap-scale flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          checked
            ? "border-green bg-green text-white shadow-press"
            : "border-border-soft bg-gold-gradient text-white/0 shadow-press"
        }`}
      >
        <Check
          size={20}
          strokeWidth={3.5}
          className={checked ? "animate-check-pop" : "opacity-0"}
        />
      </button>

      <Link
        href={`/recipe/${recipe.id}`}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {time && (
              <span className="text-[11px] font-black text-gold-deep tabular-nums">
                {time}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
              {t(meal.label)}
            </span>
          </div>
          <div
            className={`font-bold leading-snug ${checked ? "text-ink-soft line-through decoration-green/50" : "text-ink"}`}
          >
            {t(recipe.name)}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip variant="ink">{Math.round(totals.kcal)} kkal</Chip>
            <Chip variant="gold">P {totals.protein.toFixed(0)}</Chip>
            <Chip variant="muted">C {totals.carbs.toFixed(0)}</Chip>
          </div>
        </div>
        <div className="flex shrink-0 -space-x-1.5">
          {recipe.icons.slice(0, 3).map((ic, i) => (
            <span
              key={i}
              className="rounded-full bg-surface-soft ring-2 ring-surface shadow-press"
            >
              <FoodIcon icon={ic} size={26} />
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}

function Chip({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "ink" | "gold" | "muted";
}) {
  const cls =
    variant === "ink"
      ? "bg-ink text-white"
      : variant === "gold"
        ? "bg-gold-gradient text-white"
        : "bg-ink/5 text-ink-soft";
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${cls}`}>
      {children}
    </span>
  );
}
