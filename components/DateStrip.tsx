"use client";

import { addDays, dayOfWeek, dayShort, fromISODate, isToday, toISODate } from "@/lib/date";

type Props = {
  date: string;
  onSelect: (date: string) => void;
  /** markazdagi kun atrofida necha kun ko'rsatiladi (har tomonda) */
  span?: number;
};

export function DateStrip({ date, onSelect, span = 3 }: Props) {
  const today = toISODate();
  const days = Array.from({ length: span * 2 + 1 }, (_, i) => addDays(today, i - span));

  return (
    <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
      {days.map((d) => {
        const selected = d === date;
        const todayPill = isToday(d);
        const dow = dayOfWeek(d);
        const dayNum = fromISODate(d).getDate();
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            aria-current={selected ? "date" : undefined}
            className={`tap-scale flex min-w-[46px] shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 transition-colors ${
              selected
                ? "border-transparent bg-ink-gradient text-gold shadow-elevated"
                : todayPill
                ? "border-gold/50 bg-surface text-gold-deep shadow-card"
                : "border-border-soft bg-surface text-ink-soft shadow-card"
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wide ${
                selected ? "text-gold/70" : todayPill ? "text-gold-deep/70" : "text-muted"
              }`}
            >
              {dayShort(dow)}
            </span>
            <span className="text-[13px] font-black tabular-nums">{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
}
