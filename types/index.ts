// ============================================================
// NORMA — Type definitions
// ============================================================

export type Lang = "uz" | "ru" | "en";

export type Localized = Record<Lang, string>;

// ------------------------------------------------------------
// Food
// ------------------------------------------------------------

export type FoodCategory =
  | "protein"
  | "carb"
  | "veg"
  | "fruit"
  | "fat"
  | "dairy"
  | "spice";

/** Kitobdagi saqlash toifasi: A = tez ayniydi, B = haftalik, C = oylik */
export type StorageTier = "A" | "B" | "C";

export type Macros = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
};

/** 100 g uchun mikronutrientlar. mg, vitD/B12 uchun mcg */
export type Micros = {
  iron?: number;
  calcium?: number;
  vitC?: number;
  vitD?: number;
  vitB12?: number;
  vitA?: number;
  magnesium?: number;
  potassium?: number;
};

export type Food = {
  id: string;
  name: Localized;
  /** SVG ikonka kaliti (FoodIcon komponenti uchun) */
  icon: string;
  per100g: Macros;
  micros?: Micros;
  /** so'm / kg (yoki litr). Narx hisoblash uchun */
  pricePerKg: number;
  category: FoodCategory;
  storage: StorageTier;
  /** muzlatgichda necha kun turadi */
  storageDays: number;
  /** dona bilan o'lchanadigan mahsulotlar uchun */
  unit?: { label: Localized; grams: number };
};

// ------------------------------------------------------------
// Recipe
// ------------------------------------------------------------

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

/**
 * slot — tier o'zgarganda nima bo'lishini belgilaydi:
 *  protein / carb / veg / fat  → almashtirilishi mumkin
 *  fixed                        → hech qachon o'zgarmaydi (ziravor, limon)
 */
export type RecipeSlot = "protein" | "carb" | "veg" | "fruit" | "fat" | "fixed";

export type RecipeItem = {
  foodId: string;
  grams: number;
  slot: RecipeSlot;
  /** ixtiyoriy izoh: "yarim dona", "1 tish" */
  note?: Localized;
};

export type Recipe = {
  id: string;
  /** kitobdagi tartib raqami 1..32 */
  n: number;
  name: Localized;
  subtitle: Localized;
  mealType: MealType;
  /** 3 ta ikonka kaliti — kartada ko'rsatiladi */
  icons: string[];
  items: RecipeItem[];
  steps: Localized[];
  tip?: Localized;
  minutes: number;
};

// ------------------------------------------------------------
// Tier (byudjet darajasi)
// ------------------------------------------------------------

export type TierId = "economy" | "standard" | "premium";

export type TierConfig = {
  id: TierId;
  name: Localized;
  emoji: string;
  /** ustuvorlik tartibida: birinchisi asosiy manba */
  proteinSources: string[];
  carbSources: string[];
  fatSources: string[];
  /** faqat premium'da qo'shiladigan mahsulotlar */
  extras: string[];
};

// ------------------------------------------------------------
// Plan
// ------------------------------------------------------------

export type MealSlotId = "meal1" | "meal2" | "meal3" | "meal4" | "meal5";

/** 0 = yakshanba ... 6 = shanba */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type PlannedMeal = {
  slot: MealSlotId;
  label: Localized;
  recipeId: string;
  /** 1.0 = standart porsiya; gym kuni ba'zi ovqatlar kattaroq */
  portionScale?: number;
  /** garnir / qo'shimcha: "yoniga 60 g non", "1 banan" */
  extras?: RecipeItem[];
};

export type DayPlan = {
  id: string;
  dayOfWeek: DayOfWeek;
  isGymDay: boolean;
  meals: PlannedMeal[];
};

/** Ovqat vaqtlari — sozlamalarda tahrirlanadi, kun turiga qarab alohida */
export type MealTimes = Record<MealSlotId, string>; // "08:00"

export type TimeSettings = {
  restDay: MealTimes;
  gymDay: MealTimes;
};

// ------------------------------------------------------------
// User state (localStorage)
// ------------------------------------------------------------

export type DayLog = {
  /** ISO sana "2026-08-10" */
  date: string;
  tier: TierId;
  isGymDay: boolean;
  /** mealSlot -> belgilanganmi */
  checked: Partial<Record<MealSlotId, boolean>>;
  /** mealSlot -> almashtirilgan recipeId */
  swaps: Partial<Record<MealSlotId, string>>;
  waterMl: number;
};

export type BodyLog = {
  date: string;
  weightKg?: number;
  waistCm?: number;
};

export type UserSettings = {
  lang: Lang;
  tier: TierId;
  times: TimeSettings;
  targets: {
    kcalRest: number;
    kcalGym: number;
    protein: number;
    carbsRest: number;
    carbsGym: number;
    fat: number;
    waterMl: number;
  };
};

// ------------------------------------------------------------
// Calculated results
// ------------------------------------------------------------

export type NutritionTotals = Macros & {
  micros: Micros;
  /** so'm */
  cost: number;
};

export type ResolvedItem = RecipeItem & {
  food: Food;
  macros: Macros;
  cost: number;
};

export type ResolvedRecipe = {
  recipe: Recipe;
  items: ResolvedItem[];
  totals: NutritionTotals;
};
