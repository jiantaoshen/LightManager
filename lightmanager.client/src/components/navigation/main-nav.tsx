/**
 * File: components/navigation/main-nav.tsx
 * Purpose: Defines the shared desktop and mobile primary navigation.
 * Component: MainNav.
 * Data: MAIN_NAV_ITEMS.
 */

import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const MAIN_NAV_ITEMS = [
  { to: "/today", label: "Today", icon: "✓" },
  { to: "/calendar", label: "Calendar", icon: "□" },
] as const;

export function MainNav({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {MAIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              mobile
                ? "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2 text-[11px]"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )
          }
        >
          <span className={cn("text-base", mobile && "leading-none")}>{item.icon}</span>
          <span className={mobile ? "truncate" : ""}>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}
