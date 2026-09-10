import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { to: "/today", label: "Today", icon: "✓" },
  { to: "/calendar", label: "Calendar", icon: "□" },
  { to: "/tasks", label: "All tasks", icon: "≡" },
];

function NavItems({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              mobile
                ? "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2 text-[11px]"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
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

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-border px-5">
          <NavLink to="/today" className="text-base font-semibold tracking-tight">LightManager</NavLink>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavItems />
        </nav>
        <div className="border-t border-border p-3">
          <NavLink to="/profile" className="mb-2 block rounded-lg px-3 py-2 hover:bg-accent/60">
            <p className="truncate text-sm font-medium">{user?.fullName ?? "Profile"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </NavLink>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>Sign out</Button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
          <span className="font-semibold tracking-tight">LightManager</span>
          <NavLink to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
            {(user?.fullName || "U").slice(0, 1).toUpperCase()}
          </NavLink>
        </header>

        <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 md:pb-10 md:pt-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 px-1 backdrop-blur md:hidden">
        <NavItems mobile />
      </nav>
    </div>
  );
}
