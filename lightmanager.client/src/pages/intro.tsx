import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/useAuth";

export default function IntroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <span className="font-semibold tracking-tight">LightManager</span>
        <Button variant="ghost" onClick={() => navigate(user ? "/today" : "/login")}>{user ? "Open app" : "Sign in"}</Button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Personal tasks · calendar · inbox</div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">A lighter way to remember what matters.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Capture quickly on your phone, plan your day, and pick things up later from your computer. No team dashboards. No project-management overhead.</p>
          <div className="mt-8 flex gap-3"><Button size="lg" onClick={() => navigate(user ? "/today" : "/register")}>{user ? "Go to Today" : "Create account"}</Button><Button size="lg" variant="outline" onClick={() => navigate("/login")}>Sign in</Button></div>
        </div>

        <Card className="overflow-hidden p-3 shadow-xl">
          <div className="rounded-lg border border-border bg-background p-4 sm:p-6">
            <div className="mb-6"><p className="text-xs font-medium text-primary">TODAY</p><h2 className="mt-1 text-2xl font-semibold">Wednesday</h2></div>
            <div className="space-y-2">
              {["Finish CV updates", "Buy groceries", "Review LightManager API"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-border p-3"><span className={`h-5 w-5 rounded-full border ${index === 1 ? "border-primary bg-primary" : "border-muted-foreground/40"}`} /><span className="text-sm">{item}</span></div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">+ Add a task…</div>
          </div>
        </Card>
      </section>
    </main>
  );
}
