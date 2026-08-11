"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { Micros } from "@/types";

const MICRO_NAMES: Record<keyof Micros, string> = {
  iron: "Temir",
  calcium: "Kaltsiy",
  vitC: "Vit. C",
  vitD: "Vit. D",
  vitB12: "B12",
  vitA: "Vit. A",
  magnesium: "Magniy",
  potassium: "Kaliy",
};

/** Demo/placeholder foiz qiymatlari (kunlik normaga nisbatan). Haqiqiy ovqat mikronutrient
 * ma'lumotlari ulanganda bu qiymatlar calcChecked() natijasidan hisoblanadi. */
const DEMO_DATA: Record<keyof Micros, number> = {
  iron: 72,
  calcium: 58,
  vitC: 95,
  vitD: 34,
  vitB12: 88,
  vitA: 61,
  magnesium: 70,
  potassium: 65,
};

type Props = {
  data?: Partial<Record<keyof Micros, number>>;
};

export function MicroRadar({ data }: Props) {
  const values = { ...DEMO_DATA, ...data };
  const chartData = (Object.keys(MICRO_NAMES) as (keyof Micros)[]).map((key) => ({
    key,
    label: MICRO_NAMES[key],
    pct: Math.round(values[key] ?? 0),
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke="var(--color-border-soft)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 10.5, fill: "#8a8072", fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="pct"
            stroke="var(--color-gold-deep)"
            fill="var(--color-gold)"
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
