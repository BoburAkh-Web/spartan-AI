import { RECIPES, getRecipe } from "@/data/recipes";
import { DAY_PLANS, DEFAULT_SETTINGS } from "@/data/plans";
import { FOODS } from "@/data/foods";
import { calcRecipe, calcDay } from "@/lib/calc";
import { dayName } from "@/lib/date";

const pad = (s: string | number, n: number) => String(s).padEnd(n);
const padL = (s: string | number, n: number) => String(s).padStart(n);

console.log(`\nMahsulotlar: ${FOODS.length} | Retseptlar: ${RECIPES.length}\n`);
console.log("=".repeat(78));
console.log("RETSEPTLAR");
console.log("=".repeat(78));
console.log(pad("#", 4) + pad("Nom", 32) + padL("kkal", 7) + padL("P", 7) + padL("C", 7) + padL("F", 7) + padL("narx", 9));
console.log("-".repeat(78));

for (const r of RECIPES) {
  const t = calcRecipe(r).totals;
  console.log(
    pad(r.n, 4) +
      pad(r.name.uz.slice(0, 30), 32) +
      padL(t.kcal, 7) +
      padL(t.protein.toFixed(0), 7) +
      padL(t.carbs.toFixed(0), 7) +
      padL(t.fat.toFixed(0), 7) +
      padL((t.cost / 1000).toFixed(1) + "k", 9)
  );
}

console.log("\n" + "=".repeat(78));
console.log("KUNLIK REJALAR");
console.log("=".repeat(78));
console.log(
  pad("Kun", 14) + pad("Tur", 8) + padL("kkal", 7) + padL("maqsad", 8) +
  padL("P", 6) + padL("C", 6) + padL("F", 6) + padL("tola", 6) + padL("narx", 9)
);
console.log("-".repeat(78));

let weekCost = 0;
const T = DEFAULT_SETTINGS.targets;
for (const p of DAY_PLANS) {
  const t = calcDay(p, getRecipe);
  weekCost += t.cost;
  const target = p.isGymDay ? T.kcalGym : T.kcalRest;
  const diff = t.kcal - target;
  const flag = Math.abs(diff) > 250 ? "  <-- tekshir" : "";
  console.log(
    pad(dayName(p.dayOfWeek), 14) +
      pad(p.isGymDay ? "GYM" : "dam", 8) +
      padL(t.kcal, 7) +
      padL(target, 8) +
      padL(t.protein.toFixed(0), 6) +
      padL(t.carbs.toFixed(0), 6) +
      padL(t.fat.toFixed(0), 6) +
      padL(t.fiber?.toFixed(0) ?? 0, 6) +
      padL((t.cost / 1000).toFixed(0) + "k", 9) +
      flag
  );
}

console.log("-".repeat(78));
console.log(`Haftalik narx: ${(weekCost / 1000).toFixed(0)}k so'm  |  Oylik: ~${((weekCost * 4.33) / 1_000_000).toFixed(2)} mln`);

// Mikronutrient qoplanishi — o'rtacha kun
console.log("\n" + "=".repeat(78));
console.log("MIKRONUTRIENTLAR (dushanba misolida, kunlik normaga nisbatan)");
console.log("=".repeat(78));
const mon = calcDay(DAY_PLANS[1], getRecipe);
const targets: Record<string, number> = {
  iron: 8, calcium: 1000, vitC: 90, vitD: 15,
  vitB12: 2.4, vitA: 900, magnesium: 400, potassium: 3400,
};
for (const [k, target] of Object.entries(targets)) {
  const v = (mon.micros as Record<string, number>)[k] ?? 0;
  const p = Math.round((v / target) * 100);
  const bar = "#".repeat(Math.min(30, Math.round(p / 4)));
  console.log(pad(k, 12) + padL(v.toFixed(1), 9) + padL(`/ ${target}`, 10) + padL(p + "%", 7) + "  " + bar);
}
console.log();
