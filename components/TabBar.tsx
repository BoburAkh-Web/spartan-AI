"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Utensils, CalendarDays, TrendingUp, Settings } from "lucide-react";

const TABS = [
  {
    href: "/",
    label: "Bugun",
    icon: Utensils,
    match: (p: string) => p === "/",
  },
  {
    href: "/plan",
    label: "Reja",
    icon: CalendarDays,
    match: (p: string) => p.startsWith("/plan"),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: TrendingUp,
    match: (p: string) => p.startsWith("/progress"),
  },
  {
    href: "/settings",
    label: "Sozlama",
    icon: Settings,
    match: (p: string) => p.startsWith("/settings"),
  },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom px-3 pb-3">
      <div className="mx-auto flex max-w-md items-stretch justify-around rounded-2xl border border-border-soft bg-ink-gradient p-1.5 shadow-elevated">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`tap-scale flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 min-w-[44px] transition-colors duration-200 ${
                active ? "bg-gold-gradient shadow-gold-glow" : ""
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                color={active ? "var(--color-ink)" : "var(--color-muted)"}
              />
              <span
                className={`text-[10px] font-bold ${active ? "text-ink" : "text-muted"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
