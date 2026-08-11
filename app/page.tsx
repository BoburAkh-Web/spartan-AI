"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Droplets, Flame } from "lucide-react";
import { getDayPlan, DEFAULT_SETTINGS } from "@/data/plans";
import { getRecipe } from "@/data/recipes";
import { calcDay, calcChecked } from "@/lib/calc";
import { toISODate, dayOfWeek, dayName, addDays, isToday } from "@/lib/date";
import { useTimes } from "@/hooks/useTimes";
import { useDayLog } from "@/hooks/useDayLog";
import { MealCard } from "@/components/MealCard";
import { ProgressRing } from "@/components/ProgressRing";

export default function TodayPage() {
  const [date, setDate] = useState(() => toISODate());
  const dow = dayOfWeek(date);
  const plan = useMemo(() => getDayPlan(dow), [dow]);
  const { times, loaded: timesLoaded } = useTimes();
  const {
    log,
    toggle,
    copyYesterday,
    loaded: logLoaded,
  } = useDayLog(date, plan.isGymDay);

  const timeMap = plan.isGymDay ? times.gymDay : times.restDay;
  const target = plan.isGymDay
    ? DEFAULT_SETTINGS.targets.kcalGym
    : DEFAULT_SETTINGS.targets.kcalRest;
  const proteinTarget = DEFAULT_SETTINGS.targets.protein;

  const checkedTotals = calcChecked(plan, getRecipe, log.checked);
  const doneCount = Object.values(log.checked).filter(Boolean).length;
  const ready = timesLoaded && logLoaded;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-ink/50">
            Spartan AI
          </div>
          <div className="text-2xl font-black tracking-tight text-ink leading-none mt-0.5">
            {isToday(date) ? "Bugun" : dayName(dow)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDate((d) => addDays(d, -1))}
            className="tap-scale flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-press"
            aria-label="Kechagi kun"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={() => setDate((d) => addDays(d, 1))}
            className="tap-scale flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-press"
            aria-label="Ertangi kun"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border-soft bg-surface p-5 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
              plan.isGymDay
                ? "bg-ink-gradient text-gold shadow-press"
                : "bg-green-soft text-green"
            }`}
          >
            {plan.isGymDay ? "Gym kuni" : "Dam kuni"}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-muted">
            <Flame size={13} className="text-gold-deep" />
            {doneCount}/5 bajarildi
          </div>
        </div>

        <div className="flex items-center justify-around">
          <ProgressRing
            value={checkedTotals.kcal}
            target={target}
            size={116}
            strokeWidth={11}
            variant="gold"
            label={`${checkedTotals.kcal}`}
            sublabel={`/ ${target} kkal`}
          />
          <ProgressRing
            value={checkedTotals.protein}
            target={proteinTarget}
            size={116}
            strokeWidth={11}
            variant="ink"
            label={`${checkedTotals.protein.toFixed(0)}`}
            sublabel={`/ ${proteinTarget} g oqsil`}
          />
        </div>
      </div>

      <button
        onClick={copyYesterday}
        className="tap-scale flex w-full items-center justify-center gap-1.5 rounded-2xl border border-border-soft bg-surface px-3 py-2.5 text-[12px] font-bold text-ink-soft shadow-press"
      >
        <Copy size={14} /> Kechagini nusxala
      </button>

      <div className="space-y-2.5">
        {plan.meals.map((meal, i) => (
          <MealCard
            key={meal.slot}
            meal={meal}
            recipe={getRecipe(meal.recipeId)}
            time={timeMap[meal.slot]}
            checked={ready ? !!log.checked[meal.slot] : false}
            onToggle={() => toggle(meal.slot)}
            delay={i * 60}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 py-1 text-[11px] font-semibold text-ink/60">
        <Droplets size={14} className="text-gold-deep" /> Suv: kuniga 3-3.5 l
      </div>
    </div>
  );
}
