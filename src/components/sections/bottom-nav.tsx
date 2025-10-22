"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Dice6,
  Gamepad2,
  Gift,
  User2,
} from "lucide-react";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/sports", label: "Sports", Icon: Trophy },
  { href: "/casino", label: "Casino", Icon: Dice6 },
  { href: "/slots", label: "Slots", Icon: Gamepad2 },
  { href: "/promos", label: "Promo", Icon: Gift },
  { href: "/profile", label: "Me", Icon: User2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-[110] bg-[var(--sidebar-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--sidebar-background)]/80 border-t border-[var(--border)] shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      <ul className="flex items-stretch justify-around gap-0 px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="group mx-auto flex h-12 w-full max-w-[72px] flex-col items-center justify-center rounded-md text-[11px] font-medium transition-colors"
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    active ? "text-[var(--primary)] scale-110" : "text-[var(--muted-foreground)] group-active:scale-95"
                  }`}
                />
                <span
                  className={`mt-1 leading-none ${
                    active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}