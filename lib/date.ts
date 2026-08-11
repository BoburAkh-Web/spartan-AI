import type { DayOfWeek, Lang } from "@/types";

const DAY_NAMES: Record<Lang, string[]> = {
  uz: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
  ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const DAY_SHORT: Record<Lang, string[]> = {
  uz: ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha"],
  ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

/** "2026-08-10" — mahalliy vaqt bo'yicha, UTC siljishisiz */
export function toISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dayOfWeek(iso: string): DayOfWeek {
  return fromISODate(iso).getDay() as DayOfWeek;
}

export function dayName(dow: DayOfWeek, lang: Lang = "uz"): string {
  return DAY_NAMES[lang][dow];
}

export function dayShort(dow: DayOfWeek, lang: Lang = "uz"): string {
  return DAY_SHORT[lang][dow];
}

export function addDays(iso: string, n: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function isToday(iso: string): boolean {
  return iso === toISODate();
}

/** Streak — ketma-ket to'liq bajarilgan kunlar soni (bugundan orqaga) */
export function calcStreak(completedDates: Set<string>): number {
  let streak = 0;
  let cursor = toISODate();
  // bugun hali tugallanmagan bo'lishi mumkin — kechadan boshlab ham tekshiramiz
  if (!completedDates.has(cursor)) cursor = addDays(cursor, -1);
  while (completedDates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
