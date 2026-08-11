import type { Lang, Localized } from "@/types";

/** Hozircha default har doim "uz". Sozlamalarda til tanlash keyinroq qo'shiladi. */
export const DEFAULT_LANG: Lang = "uz";

export function t(loc: Localized, lang: Lang = DEFAULT_LANG): string {
  return loc[lang] ?? loc.uz;
}
