import type {
  DayPlan,
  MealSlotId,
  RecipeItem,
  TimeSettings,
  UserSettings,
} from "@/types";

/**
 * Haftalik shablon.
 * GYM KUNLARI: seshanba (2), payshanba (4), shanba (6) — kechqurun 20:00–22:30.
 * Yakshanba (0) — kun bo'yi dars 9:00–16:00, konteyner rejimi.
 */

const L = (uz: string, ru: string, en: string) => ({ uz, ru, en });

export const MEAL_LABELS = {
  meal1: L("Nonushta", "Завтрак", "Breakfast"),
  meal2: L("Tushlik", "Обед", "Lunch"),
  meal3: L("Perekus", "Перекус", "Snack"),
  meal4: L("Kechki", "Ужин", "Dinner"),
  meal5: L("Uyqu oldi", "Перед сном", "Before bed"),
} as const;

export const GYM_LABELS = {
  meal1: L("Nonushta", "Завтрак", "Breakfast"),
  meal2: L("Tushlik", "Обед", "Lunch"),
  meal3: L("Perekus", "Перекус", "Snack"),
  meal4: L("Gym oldidan", "Перед залом", "Pre-workout"),
  meal5: L("Gym'dan keyin", "После зала", "Post-workout"),
} as const;

function day(
  dayOfWeek: DayPlan["dayOfWeek"],
  isGymDay: boolean,
  ids: [string, string, string, string, string],
  extras: Partial<Record<MealSlotId, RecipeItem[]>> = {},
): DayPlan {
  const labels = isGymDay ? GYM_LABELS : MEAL_LABELS;
  const slots = ["meal1", "meal2", "meal3", "meal4", "meal5"] as const;
  return {
    id: `day-${dayOfWeek}`,
    dayOfWeek,
    isGymDay,
    meals: slots.map((slot, i) => ({
      slot,
      label: labels[slot],
      recipeId: ids[i],
      portionScale: 1,
      extras: extras[slot],
    })),
  };
}

export const DAY_PLANS: DayPlan[] = [
  // Yakshanba — dars kuni 9:00–16:00 (tushlik va perekus konteynerda)
  day(
    0,
    false,
    [
      "avokadoli-tost",
      "tovuqli-grechka-plov",
      "tuxum-tarelka",
      "tovuqli-karam-qovurma",
      "kefir-shorva",
    ],
    { meal2: [{ foodId: "grechka", grams: 70, slot: "carb" }] },
  ),

  // Dushanba — dam kuni
  day(
    1,
    false,
    [
      "tovuqli-qovurilgan-guruch",
      "tovuqli-shorva",
      "yeryongoqli-krem",
      "sabzavotli-skrembl",
      "banan-morojniy",
    ],
    { meal2: [{ foodId: "grechka", grams: 70, slot: "carb" }] },
  ),

  // Seshanba — GYM (20:00–22:30)
  day(
    2,
    true,
    [
      "tungi-ovsyanka",
      "tovuq-teriyaki",
      "apelsinli-tvorog",
      "baliq-limon",
      "yeryongoqli-krem",
    ],
    { meal5: [{ foodId: "kartoshka", grams: 300, slot: "carb" }] },
  ),

  // Chorshanba — dam kuni
  day(
    3,
    false,
    [
      "tvorog-krem-kosa",
      "tovuq-wrap",
      "yashil-smuzi",
      "baliq-kotlet",
      "shokoladli-mus",
    ],
    { meal4: [{ foodId: "kartoshka", grams: 300, slot: "carb" }] },
  ),

  // Payshanba — GYM
  day(
    4,
    true,
    [
      "protein-pankeyk",
      "mol-goshti-stirfry",
      "yashil-smuzi",
      "sabzavotli-omlet",
      "apelsinli-tvorog",
    ],
    { meal4: [{ foodId: "grechka", grams: 70, slot: "carb" }] },
  ),

  // Juma — dam kuni
  day(
    5,
    false,
    [
      "sirniki",
      "makaron-tovuq-pomidor",
      "banan-morojniy",
      "mol-goshti-kotlet",
      "tuxum-tarelka",
    ],
    { meal4: [{ foodId: "grechka", grams: 70, slot: "carb" }] },
  ),

  // Shanba — GYM
  day(
    6,
    true,
    [
      "tungi-ovsyanka",
      "tuxumli-guruch-kosa",
      "shokoladli-mus",
      "tovuqli-karam-qovurma",
      "yeryongoqli-krem",
    ],
    { meal2: [{ foodId: "guruch", grams: 70, slot: "carb" }] },
  ),
];

export function getDayPlan(dow: number): DayPlan {
  const p = DAY_PLANS.find((d) => d.dayOfWeek === dow);
  if (!p) throw new Error(`Reja topilmadi: ${dow}`);
  return p;
}

/** Sozlamalarda tahrirlanadi */
export const DEFAULT_TIMES: TimeSettings = {
  restDay: {
    meal1: "08:00",
    meal2: "12:00",
    meal3: "16:00",
    meal4: "19:30",
    meal5: "22:00",
  },
  gymDay: {
    meal1: "08:00",
    meal2: "12:00",
    meal3: "16:00",
    meal4: "19:00", // gym'gacha yengil
    meal5: "22:45", // gym'dan keyin
  },
};

export const DEFAULT_SETTINGS: UserSettings = {
  lang: "uz",
  tier: "standard",
  times: DEFAULT_TIMES,
  targets: {
    kcalRest: 2300,
    kcalGym: 2550,
    protein: 180,
    carbsRest: 205,
    carbsGym: 255,
    fat: 78,
    waterMl: 3200,
  },
};
