import type { TierConfig, TierId } from "@/types";

/**
 * Byudjet darajalari.
 * ASOSIY TAMOYIL: tier o'zgarganda OQSIL MIQDORI O'ZGARMAYDI —
 * faqat manba va narx o'zgaradi.
 */
export const TIERS: TierConfig[] = [
  {
    id: "economy",
    name: { uz: "Tejamkor", ru: "Эконом", en: "Economy" },
    emoji: "🥉",
    proteinSources: ["tuxum", "tvorog", "tovuq-son", "tovuq-jigari", "mosh", "loviya", "xamsa"],
    carbSources: ["guruch", "kartoshka", "ovsyanka", "non"],
    fatSources: ["kungaboqar-yogi"],
    extras: [],
  },
  {
    id: "standard",
    name: { uz: "O'rtacha", ru: "Стандарт", en: "Standard" },
    emoji: "🥈",
    proteinSources: ["tovuq-filesi", "tuxum", "tvorog", "skumbriya", "kefir"],
    carbSources: ["grechka", "guruch", "makaron", "ovsyanka", "kartoshka", "non"],
    fatSources: ["kungaboqar-yogi", "zaytun-yogi"],
    extras: [],
  },
  {
    id: "premium",
    name: { uz: "Premium", ru: "Премиум", en: "Premium" },
    emoji: "🥇",
    proteinSources: ["mol-goshti", "tovuq-filesi", "skumbriya", "tuxum", "tvorog"],
    carbSources: ["grechka", "makaron", "guruch", "ovsyanka", "kartoshka", "non"],
    fatSources: ["zaytun-yogi", "yeryongoq"],
    extras: ["avokado", "apelsin", "yeryongoq"],
  },
];

export const TIER_MAP: Record<TierId, TierConfig> = Object.fromEntries(
  TIERS.map((t) => [t.id, t])
) as Record<TierId, TierConfig>;
