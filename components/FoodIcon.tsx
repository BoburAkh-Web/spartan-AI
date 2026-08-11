import { FOOD_ICONS } from "./food-icons-data";

type Props = {
  icon: string;
  size?: number;
  className?: string;
};

/**
 * Kitobdagi qo'lda chizilgan mahsulot ikonkalari.
 * `dangerouslySetInnerHTML` xavfsiz: manba — bizning statik SVG to'plamimiz,
 * foydalanuvchi kiritmasi emas.
 */
export function FoodIcon({ icon, size = 28, className = "" }: Props) {
  const svg = FOOD_ICONS[icon];
  if (!svg) {
    return (
      <span
        className={`inline-block rounded-full bg-border ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
