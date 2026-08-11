"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { MEAL_LABELS, GYM_LABELS } from "@/data/plans";
import { useTheme, type ThemeId } from "@/hooks/useTheme";
import { useTimes } from "@/hooks/useTimes";
import { t } from "@/lib/i18n";
import type { MealSlotId, MealTimes } from "@/types";

const SLOTS: MealSlotId[] = ["meal1", "meal2", "meal3", "meal4", "meal5"];

export default function SettingsPage() {
  const { times, setTimes, resetTimes, loaded } = useTimes();
  const { theme, setTheme, loaded: themeLoaded } = useTheme();
  const [saved, setSaved] = useState(false);

  function updateSlot(
    group: "restDay" | "gymDay",
    slot: MealSlotId,
    value: string,
  ) {
    const next: MealTimes = { ...times[group], [slot]: value };
    setTimes({ ...times, [group]: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold">Sozlamalar</h1>
        <p className="text-[12px] text-muted">
          Ko&apos;rinish va ovqat vaqtlari
        </p>
      </div>

      {themeLoaded && (
        <div className="rounded-2xl border border-border-soft bg-surface p-4 shadow-card">
          <h2 className="mb-1 text-[13px] font-extrabold text-ink">Rejim</h2>
          <p className="mb-3 text-[11px] text-muted">
            Ikkalasi ham saqlanadi, istalgan vaqt almashtirasan
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ThemeCard
              id="spartan"
              name="Spartan"
              desc="Kuchli, energetik"
              swatches={["#f0b400", "#1c1712", "#ffffff"]}
              active={theme === "spartan"}
              onClick={() => setTheme("spartan")}
            />
            <ThemeCard
              id="sokin"
              name="Sokin"
              desc="Tinch, tiklanish"
              swatches={["#c97b5a", "#5c8a6c", "#ffffff"]}
              active={theme === "sokin"}
              onClick={() => setTheme("sokin")}
            />
          </div>
        </div>
      )}

      {!loaded ? (
        <div className="py-10 text-center text-[12px] text-muted">
          Yuklanmoqda...
        </div>
      ) : (
        <>
          <TimeGroup
            title="Dam kuni vaqtlari"
            labels={MEAL_LABELS}
            values={times.restDay}
            onChange={(slot, v) => updateSlot("restDay", slot, v)}
          />
          <TimeGroup
            title="Gym kuni vaqtlari"
            subtitle="Seshanba · Payshanba · Shanba"
            labels={GYM_LABELS}
            values={times.gymDay}
            onChange={(slot, v) => updateSlot("gymDay", slot, v)}
          />

          <button
            onClick={resetTimes}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border-soft bg-surface py-3 text-[13px] font-semibold text-ink-soft"
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
  labels,
  values,
  onChange,
}: {
  title: string;
  subtitle?: string;
  labels: typeof MEAL_LABELS;
  values: MealTimes;
  onChange: (slot: MealSlotId, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-3">
      <div className="mb-2">
        <h2 className="text-[13px] font-extrabold text-ink">{title}</h2>
        {subtitle && <p className="text-[10.5px] text-muted">{subtitle}</p>}
      </div>
      <div className="space-y-2">
        {SLOTS.map((slot) => (
          <div key={slot} className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-ink-soft">
              {t(labels[slot])}
            </span>
            <input
              type="time"
              value={values[slot]}
              onChange={(e) => onChange(slot, e.target.value)}
              className="rounded-lg border border-border-soft bg-surface-soft px-2.5 py-1.5 text-[13px] font-semibold tabular-nums text-ink"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemeCard({
  name,
  desc,
  swatches,
  active,
  onClick,
}: {
  id: ThemeId;
  name: string;
  desc: string;
  swatches: string[];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`tap-scale flex flex-col items-start rounded-xl border-2 p-3 text-left transition-all ${
        active ? "border-ink shadow-card" : "border-border-soft"
      }`}
    >
      <div className="flex -space-x-1.5 mb-2">
        {swatches.map((c, i) => (
          <span
            key={i}
            className="h-6 w-6 rounded-full border border-black/10"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="text-[13px] font-extrabold text-ink">{name}</div>
      <div className="text-[10.5px] text-muted">{desc}</div>
    </button>
  );
}
