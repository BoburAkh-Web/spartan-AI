"use client";

import type { DayLog, MealSlotId, TimeSettings } from "@/types";
import { DEFAULT_TIMES } from "@/data/plans";
import { toISODate } from "@/lib/date";

const KEYS = {
  times: "norma:times",
  dayLog: (date: string) => `norma:day:${date}`,
  dayIndex: "norma:day-index", // barcha saqlangan sanalar ro'yxati
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* xotira to'lgan yoki mavjud emas — sokin o'tkazib yuboramiz */
  }
}

// ---------------- Vaqt sozlamalari ----------------

export function getTimes(): TimeSettings {
  return safeGet(KEYS.times, DEFAULT_TIMES);
}

export function setTimes(times: TimeSettings): void {
  safeSet(KEYS.times, times);
}

// ---------------- Kunlik jurnal ----------------

function emptyDayLog(date: string, isGymDay: boolean): DayLog {
  return { date, tier: "standard", isGymDay, checked: {}, swaps: {}, waterMl: 0 };
}

export function getDayLog(date: string, isGymDay: boolean): DayLog {
  const log = safeGet<DayLog | null>(KEYS.dayLog(date), null);
  return log ?? emptyDayLog(date, isGymDay);
}

function touchIndex(date: string) {
  const idx = safeGet<string[]>(KEYS.dayIndex, []);
  if (!idx.includes(date)) {
    idx.push(date);
    safeSet(KEYS.dayIndex, idx);
  }
}

export function setDayLog(log: DayLog): void {
  safeSet(KEYS.dayLog(log.date), log);
  touchIndex(log.date);
}

export function toggleMeal(date: string, isGymDay: boolean, slot: MealSlotId): DayLog {
  const log = getDayLog(date, isGymDay);
  const next: DayLog = { ...log, checked: { ...log.checked, [slot]: !log.checked[slot] } };
  setDayLog(next);
  return next;
}

export function copyYesterday(date: string, isGymDay: boolean): DayLog {
  const y = new Date(date);
  y.setDate(y.getDate() - 1);
  const yISO = toISODate(y);
  const prev = safeGet<DayLog | null>(KEYS.dayLog(yISO), null);
  const next: DayLog = prev
    ? { ...prev, date, isGymDay }
    : emptyDayLog(date, isGymDay);
  setDayLog(next);
  return next;
}

/** Barcha saqlangan kunlarni sana bo'yicha o'sish tartibida qaytaradi */
export function listDayLogs(): DayLog[] {
  const idx = safeGet<string[]>(KEYS.dayIndex, []);
  return idx
    .map((d) => safeGet<DayLog | null>(KEYS.dayLog(d), null))
    .filter((x): x is DayLog => x !== null)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
