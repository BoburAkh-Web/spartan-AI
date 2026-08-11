"use client";

import { useEffect, useState } from "react";
import type { TimeSettings } from "@/types";
import { DEFAULT_TIMES } from "@/data/plans";
import { getTimes, setTimes as persistTimes } from "@/lib/storage";

export function useTimes() {
  const [times, setTimesState] = useState<TimeSettings>(DEFAULT_TIMES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimesState(getTimes());
    setLoaded(true);
  }, []);

  function update(next: TimeSettings) {
    setTimesState(next);
    persistTimes(next);
  }

  function reset() {
    setTimesState(DEFAULT_TIMES);
    persistTimes(DEFAULT_TIMES);
  }

  return { times, setTimes: update, resetTimes: reset, loaded };
}
