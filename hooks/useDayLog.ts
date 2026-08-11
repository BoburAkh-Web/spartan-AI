"use client";

import { useEffect, useState } from "react";
import type { DayLog, MealSlotId } from "@/types";
import {
  getDayLog,
  toggleMeal as persistToggle,
  copyYesterday as persistCopyYesterday,
} from "@/lib/storage";

export function useDayLog(date: string, isGymDay: boolean) {
  const [log, setLog] = useState<DayLog>({
    date,
    tier: "standard",
    isGymDay,
    checked: {},
    swaps: {},
    waterMl: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLog(getDayLog(date, isGymDay));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, isGymDay]);

  function toggle(slot: MealSlotId) {
    setLog(persistToggle(date, isGymDay, slot));
  }

  function copyYesterday() {
    setLog(persistCopyYesterday(date, isGymDay));
  }

  return { log, toggle, copyYesterday, loaded };
}
