import { DAY_PLANS } from "@/data/plans";
import { DayCard } from "@/components/DayCard";
import { dayOfWeek, toISODate } from "@/lib/date";

// Ko'rinish tartibi: Dushanba -> Yakshanba (haftalik reja sifatida tabiiyroq)
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function PlanPage() {
  const todayDow = dayOfWeek(toISODate());
  const ordered = DISPLAY_ORDER.map((dow) => DAY_PLANS.find((p) => p.dayOfWeek === dow)!);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-ink">Haftalik reja</h1>
        <p className="text-[12px] text-muted">Kunni tanla — 5 mahal ovqat va retseptlarni ko&apos;r</p>
      </div>
      <div className="space-y-2.5">
        {ordered.map((plan, i) => (
          <div key={plan.id} className="animate-pop-in" style={{ animationDelay: `${i * 60}ms` }}>
            <DayCard plan={plan} isToday={plan.dayOfWeek === todayDow} />
          </div>
        ))}
      </div>
    </div>
  );
}
