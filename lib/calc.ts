import type {
  Food,
  Macros,
  Micros,
  NutritionTotals,
  Recipe,
  RecipeItem,
  ResolvedItem,
  ResolvedRecipe,
  DayPlan,
  TierId,
} from "@/types";
import { getFood } from "@/data/foods";

const MICRO_KEYS: (keyof Micros)[] = [
  "iron",
  "calcium",
  "vitC",
  "vitD",
  "vitB12",
  "vitA",
  "magnesium",
  "potassium",
];

export const emptyMacros = (): Macros => ({
  kcal: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
});

export const emptyTotals = (): NutritionTotals => ({
  ...emptyMacros(),
  micros: {},
  cost: 0,
});

/** Mahsulotning berilgan grammdagi makrosi */
export function macrosFor(food: Food, grams: number): Macros {
  const k = grams / 100;
  return {
    kcal: food.per100g.kcal * k,
    protein: food.per100g.protein * k,
    carbs: food.per100g.carbs * k,
    fat: food.per100g.fat * k,
    fiber: (food.per100g.fiber ?? 0) * k,
  };
}

/** Mahsulotning berilgan grammdagi mikronutrientlari */
export function microsFor(food: Food, grams: number): Micros {
  if (!food.micros) return {};
  const k = grams / 100;
  const out: Micros = {};
  for (const key of MICRO_KEYS) {
    const v = food.micros[key];
    if (v != null) out[key] = v * k;
  }
  return out;
}

/** Narx — so'm */
export function costFor(food: Food, grams: number): number {
  return (food.pricePerKg / 1000) * grams;
}

export function addMacros(a: Macros, b: Macros): Macros {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    fiber: (a.fiber ?? 0) + (b.fiber ?? 0),
  };
}

export function addMicros(a: Micros, b: Micros): Micros {
  const out: Micros = { ...a };
  for (const key of MICRO_KEYS) {
    const v = b[key];
    if (v != null) out[key] = (out[key] ?? 0) + v;
  }
  return out;
}

export function addTotals(a: NutritionTotals, b: NutritionTotals): NutritionTotals {
  return {
    ...addMacros(a, b),
    micros: addMicros(a.micros, b.micros),
    cost: a.cost + b.cost,
  };
}

/** Bitta ingredientni to'liq hisoblab qaytaradi */
export function resolveItem(item: RecipeItem, scale = 1): ResolvedItem {
  const food = getFood(item.foodId);
  const grams = item.grams * scale;
  return {
    ...item,
    grams,
    food,
    macros: macrosFor(food, grams),
    cost: costFor(food, grams),
  };
}

/**
 * Retseptni to'liq hisoblaydi.
 * @param scale porsiya koeffitsienti (gym kuni 1.15 kabi)
 */
export function calcRecipe(recipe: Recipe, scale = 1): ResolvedRecipe {
  const items = recipe.items.map((i) => resolveItem(i, scale));
  let totals = emptyTotals();
  for (const it of items) {
    totals = addTotals(totals, {
      ...it.macros,
      micros: microsFor(it.food, it.grams),
      cost: it.cost,
    });
  }
  return { recipe, items, totals: roundTotals(totals) };
}

/** Garnir / qo'shimcha mahsulotlar jami */
export function extrasTotals(extras?: RecipeItem[]): NutritionTotals {
  let t = emptyTotals();
  if (!extras) return t;
  for (const e of extras) {
    const it = resolveItem(e);
    t = addTotals(t, { ...it.macros, micros: microsFor(it.food, it.grams), cost: it.cost });
  }
  return t;
}

/** Kunlik jami — reja bo'yicha */
export function calcDay(
  plan: DayPlan,
  recipeById: (id: string) => Recipe,
  swaps: Partial<Record<string, string>> = {}
): NutritionTotals {
  let totals = emptyTotals();
  for (const meal of plan.meals) {
    const rid = swaps[meal.slot] ?? meal.recipeId;
    const r = recipeById(rid);
    const res = calcRecipe(r, meal.portionScale ?? 1);
    totals = addTotals(totals, res.totals);
    totals = addTotals(totals, extrasTotals(meal.extras));
  }
  return roundTotals(totals);
}

/** Faqat belgilangan (checked) ovqatlar jami — progress uchun */
export function calcChecked(
  plan: DayPlan,
  recipeById: (id: string) => Recipe,
  checked: Partial<Record<string, boolean>>,
  swaps: Partial<Record<string, string>> = {}
): NutritionTotals {
  let totals = emptyTotals();
  for (const meal of plan.meals) {
    if (!checked[meal.slot]) continue;
    const rid = swaps[meal.slot] ?? meal.recipeId;
    const res = calcRecipe(recipeById(rid), meal.portionScale ?? 1);
    totals = addTotals(totals, res.totals);
    totals = addTotals(totals, extrasTotals(meal.extras));
  }
  return roundTotals(totals);
}

export function roundTotals(t: NutritionTotals): NutritionTotals {
  const micros: Micros = {};
  for (const key of MICRO_KEYS) {
    const v = t.micros[key];
    if (v != null) micros[key] = Math.round(v * 10) / 10;
  }
  return {
    kcal: Math.round(t.kcal),
    protein: Math.round(t.protein * 10) / 10,
    carbs: Math.round(t.carbs * 10) / 10,
    fat: Math.round(t.fat * 10) / 10,
    fiber: Math.round((t.fiber ?? 0) * 10) / 10,
    micros,
    cost: Math.round(t.cost),
  };
}

/** Foiz — progress halqasi uchun (0..100+, cheklanmaydi) */
export function pct(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.round((value / target) * 100);
}

/** Kunlik mikronutrient normalari (erkak, 22 yosh) — radar chart uchun */
export const MICRO_TARGETS: Required<Micros> = {
  iron: 8,
  calcium: 1000,
  vitC: 90,
  vitD: 15,
  vitB12: 2.4,
  vitA: 900,
  magnesium: 400,
  potassium: 3400,
};
