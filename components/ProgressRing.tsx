"use client";

import { useId } from "react";

type Props = {
  value: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: "gold" | "ink";
};

export function ProgressRing({
  value,
  target,
  size = 120,
  strokeWidth = 11,
  label,
  sublabel,
  variant = "gold",
}: Props) {
  const id = useId();
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const gradId = `ring-grad-${variant}-${id}`;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Gold porlash effekti */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.86,
          height: size * 0.86,
          background:
            variant === "gold"
              ? "radial-gradient(circle, rgba(240,180,0,0.35) 0%, rgba(240,180,0,0) 70%)"
              : "radial-gradient(circle, rgba(28,23,18,0.12) 0%, rgba(28,23,18,0) 70%)",
          filter: "blur(6px)",
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 relative"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {variant === "gold" ? (
              <>
                <stop offset="0%" stopColor="#f7c530" />
                <stop offset="100%" stopColor="#c98f00" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#3a322a" />
                <stop offset="100%" stopColor="#1c1712" />
              </>
            )}
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(28,23,18,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-black tracking-tight text-ink leading-none">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] font-semibold text-muted mt-1 text-center px-2">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
