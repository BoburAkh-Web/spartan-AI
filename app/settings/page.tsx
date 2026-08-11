"use client";

import { useState } from "react";
import { RotateCcw, Check, Sun, Dumbbell } from "lucide-react";
import { MEAL_LABELS, GYM_LABELS } from "@/data/plans";
import { useTimes } from "@/hooks/useTimes";
import { t } from "@/lib/i18n";
import type { MealSlotId, MealTimes } from "@/types";

const SLOTS: MealSlotId[] = ["meal1", "meal2", "meal3", "meal4", "meal5"];

export default function SettingsPage() {
  const { times, setTimes, resetTimes, loaded } = useTimes();
  const [saved, setSaved] = useState(false);

  function updateSlot(group: "restDay" | "gymDay", slot: MealSlotId, value: string) {
    const next: MealTimes = { ...times[group], [slot]: value };
    setTimes({ ...times, [group]: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink">Sozlamalar</h1>
        <p className="text-[12px] text-muted">Ovqat vaqtlarini o&apos;zgartirish</p>
      </div>

      {!loaded ? (
        <div className="py-10 text-center text-[12px] text-muted">Yuklanmoqda...</div>
      ) : (
        <>
          <TimeGroup
            title="Dam kuni vaqtlari"
            icon={<Sun size={16} color="var(--color-green)" />}
            tone="green"
            labels={MEAL_LABELS}
            values={times.restDay}
            onChange={(slot, v) => updateSlot("restDay", slot, v)}
          />
          <TimeGroup
            title="Gym kuni vaqtlari"
            subtitle="Seshanba · Payshanba · Shanba"
            icon={<Dumbbell size={16} color="var(--color-gold-deep)" />}
            tone="gold"
            labels={GYM_LABELS}
            values={times.gymDay}
            onChange={(slot, v) => updateSlot("gymDay", slot, v)}
          />

          <button
            onClick={resetTimes}
            className="tap-scale flex w-full items-center justify-center gap-2 rounded-2xl border border-border-soft bg-surface py-3 text-[13px] font-semibold text-ink-soft shadow-card"
          >
            <RotateCcw size={15} /> Standart vaqtlarga qaytarish
          </button>

          <div
            className={`flex items-center justify-center gap-1.5 text-[12px] font-semibold text-green transition-opacity ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check size={14} /> Saqlandi
          </div>

          <p className="text-center text-[11px] text-muted">
            Boshqa sozlamalar (til, byudjet darajasi) keyinroq qo&apos;shiladi.
          </p>
        </>
      )}
    </div>
  );
}

function TimeGroup({
  title,
  subtitle,
  icon,
  tone,
  labels,
  values,
  onChange,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  tone: "green" | "gold";
  labels: typeof MEAL_LABELS;
  values: MealTimes;
  onChange: (slot: MealSlotId, value: string) => void;
}) {
  const iconBg = tone === "green" ? "bg-green-soft" : "bg-gold/15";
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </span>
        <div>
          <h2 className="text-[13px] font-extrabold text-ink">{title}</h2>
          {subtitle && <p className="text-[10.5px] text-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        {SLOTS.map((slot) => (
          <div
            key={slot}
            className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-1.5 odd:bg-surface-soft"
          >
            <span className="text-[12.5px] font-medium text-ink-soft">{t(labels[slot])}</span>
            <input
              type="time"
              value={values[slot]}
              onChange={(e) => onChange(slot, e.target.value)}
              className="rounded-full border border-border-soft bg-surface-soft px-3 py-1.5 text-[13px] font-semibold tabular-nums text-ink"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
