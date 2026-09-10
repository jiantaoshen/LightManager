/**
 * File: components/AppShell.tsx
 * Purpose: Defines the authenticated application shell for desktop and mobile layouts.
 * Component: AppShell.
 * Uses: MainNav, AccountMenu, Outlet.
 */

import { NavLink, Outlet } from "react-router-dom";
import { AccountMenu } from "./navigation/account-menu";
import { MainNav } from "./navigation/main-nav";

export default function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-border px-5">
          <NavLink to="/today" className="text-base font-semibold tracking-tight">
            LightManager
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <MainNav />
        </nav>

        <div className="border-t border-border p-3">
          <AccountMenu />
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
          <NavLink to="/today" className="font-semibold tracking-tight">
            LightManager
          </NavLink>
          <AccountMenu mobile />
        </header>

        <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 md:pb-10 md:pt-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 px-1 backdrop-blur md:hidden">
        <MainNav mobile />
      </nav>
    </div>
  );
}
