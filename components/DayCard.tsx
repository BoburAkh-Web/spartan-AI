import Link from "next/link";
import type { DayPlan } from "@/types";
import { calcDay } from "@/lib/calc";
import { getRecipe } from "@/data/recipes";
import { dayName } from "@/lib/date";
import { DEFAULT_SETTINGS } from "@/data/plans";
import { FoodIcon } from "./FoodIcon";

export function DayCard({
  plan,
  isToday,
}: {
  plan: DayPlan;
  isToday?: boolean;
}) {
  const totals = calcDay(plan, getRecipe);
  const target = plan.isGymDay
    ? DEFAULT_SETTINGS.targets.kcalGym
    : DEFAULT_SETTINGS.targets.kcalRest;
  const allIcons = plan.meals
    .flatMap((m) => getRecipe(m.recipeId).icons)
    .slice(0, 5);

  return (
    <Link
      href={`/plan/${plan.dayOfWeek}`}
      className={`tap-scale block rounded-2xl border p-4 transition-all ${
        isToday
          ? "border-transparent bg-ink-gradient shadow-elevated"
          : "border-border-soft bg-surface shadow-card"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-base font-black ${isToday ? "text-gold" : "text-ink"}`}
        >
          {dayName(plan.dayOfWeek)}
        </span>
        {isToday && (
          <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-press">
            Bugun
          </span>
        )}
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${
            plan.isGymDay
              ? isToday
                ? "bg-gold/20 text-gold"
                : "bg-ink text-gold"
              : isToday
                ? "bg-white/10 text-white/70"
                : "bg-green-soft text-green"
          }`}
        >
          {plan.isGymDay ? "Gym" : "Dam"}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex -space-x-2">
          {allIcons.map((ic, i) => (
            <span
              key={i}
              className={`rounded-full ring-2 shadow-press ${isToday ? "bg-surface-soft ring-ink" : "bg-surface-soft ring-surface"}`}
            >
              <FoodIcon icon={ic} size={26} />
            </span>
          ))}
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-black tabular-nums ${isToday ? "text-white" : "text-ink"}`}
          >
            {totals.kcal}
          </div>
          <div
            className={`text-[10px] font-semibold ${isToday ? "text-white/50" : "text-muted"}`}
          >
            / {target} kkal
          </div>
        </div>
      </div>
    </Link>
  );
}
