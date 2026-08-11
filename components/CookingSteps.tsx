"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type Props = {
  steps: string[];
};

/** "Pishirish rejimi" — foydalanuvchi qadamlarni belgilab borishi mumkin. Faqat shu sahifada,
 * local state, saqlash shart emas. */
export function CookingSteps({ steps }: Props) {
  const [done, setDone] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-extrabold text-ink">Qadamlar</h2>
        <span className="text-[11px] font-semibold text-muted">
          {done.size}/{steps.length} bajarildi
        </span>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => {
          const checked = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                className={`tap-scale flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
                  checked ? "border-green/25 bg-green-soft" : "border-transparent"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-press ${
                    checked ? "bg-green text-white animate-check-pop" : "bg-gold-gradient text-ink"
                  }`}
                >
                  {checked ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`pt-0.5 text-[13px] ${
                    checked ? "text-ink-soft line-through decoration-green/50" : "text-ink-soft"
                  }`}
                >
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
