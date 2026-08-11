import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock } from "lucide-react";
import { RECIPES, RECIPE_MAP } from "@/data/recipes";
import { calcRecipe } from "@/lib/calc";
import { t } from "@/lib/i18n";
import { FoodIcon } from "@/components/FoodIcon";
import { CookingSteps } from "@/components/CookingSteps";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = RECIPE_MAP[id];
  if (!recipe) notFound();

  const { items, totals } = calcRecipe(recipe);

  return (
    <div className="space-y-4">
      <Link href="/plan" className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted">
        <ChevronLeft size={15} /> Orqaga
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-gold-gradient p-5 shadow-elevated">
        <div className="pointer-events-none absolute -right-4 -top-4 opacity-20">
          <FoodIcon icon={recipe.icons[0]} size={120} />
        </div>
        <div className="relative">
          <div className="flex -space-x-3">
            {recipe.icons.map((ic, i) => (
              <span key={i} className="rounded-full bg-surface ring-4 ring-gold-bright/40 shadow-press">
                <FoodIcon icon={ic} size={52} />
              </span>
            ))}
          </div>
          <div className="mt-3">
            <div className="text-[10px] font-black uppercase tracking-wider text-ink/60">
              Retsept {String(recipe.n).padStart(2, "0")}
            </div>
            <h1 className="text-xl font-black leading-snug text-ink">{t(recipe.name)}</h1>
            <p className="text-[12.5px] italic text-ink/70">{t(recipe.subtitle)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip tone="dark">{totals.kcal} kkal</Chip>
        <Chip tone="gold">Oqsil {totals.protein.toFixed(0)} g</Chip>
        <Chip tone="muted">Uglevod {totals.carbs.toFixed(0)} g</Chip>
        <Chip tone="green">Yog&apos; {totals.fat.toFixed(0)} g</Chip>
        <span className="flex items-center gap-1 rounded-md bg-ink/5 px-1.5 py-0.5 text-[10.5px] font-bold text-ink-soft">
          <Clock size={11} /> {recipe.minutes} daq
        </span>
      </div>

      <section>
        <h2 className="mb-2 text-[13px] font-extrabold text-ink">Ingredientlar</h2>
        <div className="divide-y divide-border-soft rounded-2xl border border-border-soft bg-surface shadow-card">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 text-[13px]">
              <FoodIcon icon={it.food.icon} size={26} />
              <span className="flex-1 text-ink-soft">{t(it.food.name)}</span>
              <span className="font-mono text-[12px] font-semibold text-green">
                {it.note ? t(it.note) : it.foodId === "ziravor" ? "chimdim" : `${Math.round(it.grams)} g`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-surface p-3 shadow-card">
        <CookingSteps steps={recipe.steps.map((s) => t(s))} />
      </section>

      {recipe.tip && (
        <div className="rounded-xl border-l-4 border-gold bg-surface-soft p-3 text-[12.5px] text-ink-soft shadow-card">
          <span className="font-black text-gold-deep">Maslahat: </span>
          {t(recipe.tip)}
        </div>
      )}
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "dark" | "gold" | "muted" | "green" }) {
  const cls = {
    dark: "bg-ink text-white",
    gold: "bg-gold-gradient text-white",
    muted: "bg-ink/5 text-ink-soft",
    green: "bg-green-soft text-green",
  }[tone];
  return <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${cls}`}>{children}</span>;
}
