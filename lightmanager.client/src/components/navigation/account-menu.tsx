/**
 * File: components/navigation/account-menu.tsx
 * Purpose: Provides the shared account/avatar menu for desktop and mobile layouts.
 * Component: AccountMenu.
 * Functions: goTo, handleLogout, outside-click effect.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { STORAGE_KEYS } from "../../lib/storage";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  mobile?: boolean;
};

export function AccountMenu({ mobile = false }: AccountMenuProps) {
  const { user, logout, isTrial } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = isTrial
    ? "T"
    : (user?.fullName || "U").slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    localStorage.removeItem(STORAGE_KEYS.authToken);
    navigate(isTrial ? "/" : "/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex items-center transition-colors hover:bg-accent/60",
          mobile
            ? "h-8 w-8 justify-center rounded-full bg-secondary text-xs font-semibold"
            : "w-full gap-3 rounded-lg px-3 py-2 text-left",
        )}
        aria-label="Open account menu"
        aria-expanded={open}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold",
            mobile ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm",
          )}
        >
          {initials}
        </span>

        {!mobile && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {isTrial ? "Trial mode" : user?.fullName ?? "Account"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {isTrial ? "Local changes only" : user?.email}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">•••</span>
          </>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
            mobile ? "right-0 top-10" : "bottom-full left-0 mb-2 w-full",
          )}
        >
          {mobile && (
            <div className="border-b border-border px-3 py-2">
              <p className="truncate text-sm font-medium">
                {isTrial ? "Trial mode" : user?.fullName ?? "Account"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {isTrial ? "Local changes only" : user?.email}
              </p>
            </div>
          )}

          {!isTrial && (
            <button
              type="button"
              onClick={() => goTo("/profile")}
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <span className="mr-3">⚙</span>
              Settings
            </button>
          )}

          <button
            type="button"
            onClick={() => goTo("/tasks")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
          >
            <span className="mr-3">≡</span>
            All tasks
          </button>

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
          >
            <span className="mr-3">↪</span>
            {isTrial ? "Exit trial" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
