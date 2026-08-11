import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getDayPlan, DEFAULT_TIMES, DEFAULT_SETTINGS } from "@/data/plans";
import { getRecipe } from "@/data/recipes";
import { calcDay, calcRecipe, extrasTotals, addTotals } from "@/lib/calc";
import { dayName } from "@/lib/date";
import { t } from "@/lib/i18n";
import { FoodIcon } from "@/components/FoodIcon";
import { ProgressRing } from "@/components/ProgressRing";

export function generateStaticParams() {
  return [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day: String(d) }));
}

export default async function DayDetailPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dow = Number(day);
  if (!Number.isInteger(dow) || dow < 0 || dow > 6) notFound();

  const plan = getDayPlan(dow);
  const timeMap = plan.isGymDay ? DEFAULT_TIMES.gymDay : DEFAULT_TIMES.restDay;
  const target = plan.isGymDay ? DEFAULT_SETTINGS.targets.kcalGym : DEFAULT_SETTINGS.targets.kcalRest;
  const totals = calcDay(plan, getRecipe);

  return (
    <div className="space-y-4">
      <Link href="/plan" className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted">
        <ChevronLeft size={15} /> Hafta
      </Link>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-black text-ink">{dayName(plan.dayOfWeek)}</h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
            plan.isGymDay ? "bg-ink text-gold" : "bg-green-soft text-green"
          }`}
        >
          {plan.isGymDay ? "Gym kuni" : "Dam kuni"}
        </span>
      </div>

      <div className="rounded-3xl border border-border-soft bg-surface p-5 shadow-elevated">
        <div className="flex items-center justify-center gap-5">
          <ProgressRing
            value={totals.kcal}
            target={target}
            size={112}
            strokeWidth={10}
            variant="gold"
            label={`${totals.kcal}`}
            sublabel={`/ ${target} kkal`}
          />
          <div className="flex flex-col gap-2 text-[12.5px] font-semibold text-ink-soft">
            <span>
              Oqsil <span className="font-black text-ink">{totals.protein.toFixed(0)} g</span>
            </span>
            <span>
              Uglevod <span className="font-black text-ink">{totals.carbs.toFixed(0)} g</span>
            </span>
            <span>
              Yog&apos; <span className="font-black text-ink">{totals.fat.toFixed(0)} g</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {plan.meals.map((meal, i) => {
          const recipe = getRecipe(meal.recipeId);
          const base = calcRecipe(recipe, meal.portionScale ?? 1).totals;
          const mealTotals = addTotals(base, extrasTotals(meal.extras));
          return (
            <Link
              key={meal.slot}
              href={`/recipe/${recipe.id}`}
              className="tap-scale animate-pop-in flex items-center gap-3 rounded-2xl border border-border-soft bg-surface p-3 shadow-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex -space-x-1.5">
                {recipe.icons.slice(0, 3).map((ic, i) => (
                  <span key={i} className="rounded-full bg-surface-soft ring-2 ring-surface shadow-press">
                    <FoodIcon icon={ic} size={30} />
                  </span>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-gold-deep tabular-nums">{timeMap[meal.slot]}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{t(meal.label)}</span>
                </div>
                <div className="font-bold text-ink leading-snug">{t(recipe.name)}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[10.5px] font-bold text-ink-soft">
                    {Math.round(mealTotals.kcal)} kkal
                  </span>
                  <span className="rounded-md bg-gold-gradient px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                    P {mealTotals.protein.toFixed(0)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
