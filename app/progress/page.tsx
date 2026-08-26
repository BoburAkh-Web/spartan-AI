"use client";

import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { listDayLogs } from "@/lib/storage";
import { addDays, toISODate, dayShort, dayOfWeek, calcStreak } from "@/lib/date";
import { MicroRadar } from "@/components/MicroRadar";
import { SpartanLogo } from "@/components/SpartanLogo";
import type { DayLog } from "@/types";

const TOTAL_SLOTS = 5;

function isDayComplete(log: DayLog): boolean {
  return Object.values(log.checked).filter(Boolean).length >= TOTAL_SLOTS;
}

export default function ProgressPage() {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLogs(listDayLogs());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="py-16 text-center text-[12px] text-muted">Yuklanmoqda...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <SpartanLogo size={26} className="text-ink shrink-0" />
          <h1 className="text-xl font-black text-ink">Progress</h1>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border-soft bg-surface py-14 text-center shadow-card">
          <Sparkles size={30} color="var(--color-gold-deep)" />
          <div className="max-w-[220px] text-[13px] font-semibold text-ink">
            Hali hech narsa belgilanmagan
          </div>
          <p className="max-w-[220px] text-[12px] text-muted">
            &quot;Bugun&quot; sahifasida ovqatlarni belgila — progress shu yerda to&apos;planib boradi.
          </p>
        </div>
      </div>
    );
  }

  const completedDates = new Set(logs.filter(isDayComplete).map((l) => l.date));
  const streak = calcStreak(completedDates);

  const today = toISODate();
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const chartData = last7.map((date) => {
    const log = logs.find((l) => l.date === date);
    const done = log ? Object.values(log.checked).filter(Boolean).length : 0;
    return {
      date,
      label: dayShort(dayOfWeek(date)),
      pct: Math.round((done / TOTAL_SLOTS) * 100),
      isToday: date === today,
    };
  });

  const totalDays = logs.length;
  const avgCompletion =
    (logs.reduce((sum, l) => sum + Object.values(l.checked).filter(Boolean).length, 0) /
      (totalDays * TOTAL_SLOTS)) *
    100;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <SpartanLogo size={26} className="text-ink shrink-0" />
        <h1 className="text-xl font-black text-ink">Progress</h1>
      </div>

      {/* Hero — streak */}
      <div className="animate-pop-in relative overflow-hidden rounded-3xl border border-border-soft bg-ink-gradient p-6 text-white shadow-elevated">
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gold/15" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/15 shadow-gold-glow">
            <Flame size={30} color="var(--color-gold)" />
          </div>
          <div>
            <div className="text-5xl font-black leading-none tabular-nums text-gold">
              {streak}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-white/60">
              kun ketma-ket to&apos;liq bajarilgan
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-black leading-none tabular-nums">
              {Math.round(avgCompletion)}%
            </div>
            <div className="mt-1 text-[10px] text-white/60">o&apos;rtacha bajarish</div>
          </div>
        </div>
      </div>

      {/* Haftalik bajarish */}
      <div className="rounded-2xl border border-border-soft bg-surface p-4 shadow-card">
        <h2 className="mb-3 text-[13px] font-extrabold text-ink">So&apos;nggi 7 kun</h2>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "var(--color-surface-soft)" }}
                formatter={(v) => [`${v}%`, "Bajarilgan"]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--color-border-soft)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="pct" radius={[6, 6, 6, 6]}>
                {chartData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.isToday
                        ? "var(--color-gold)"
                        : d.pct >= 100
                        ? "var(--color-green)"
                        : "var(--color-border-soft)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mikronutrientlar — radar */}
      <div className="rounded-2xl border border-border-soft bg-surface p-4 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold text-ink">Mikronutrientlar</h2>
          <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-white">
            Demo
          </span>
        </div>
        <p className="mb-1 text-[11px] text-muted">
          Kunlik normaga nisbatan foiz — mahsulot mikronutrient ma&apos;lumotlari ulanganda haqiqiy qiymatlar bilan yangilanadi.
        </p>
        <MicroRadar />
      </div>

      <div className="rounded-2xl border border-dashed border-border-soft p-3 text-center text-[11px] text-muted">
        Jami {totalDays} kun qayd etilgan. Vazn/bel grafigi keyinroq qo&apos;shiladi.
      </div>
    </div>
  );
}
