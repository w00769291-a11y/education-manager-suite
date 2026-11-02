import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useSales } from "@/lib/sales-store";
import { cn } from "@/lib/utils";

export function AgentSideNav() {
  const { agents } = useSales();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(t) ||
        a.team.toLowerCase().includes(t) ||
        a.email.toLowerCase().includes(t),
    );
  }, [agents, q]);

  const statusDot = (s: string) =>
    s === "Active"
      ? "bg-success"
      : s === "On call"
        ? "bg-warning"
        : "bg-muted-foreground/40";

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-200 relative",
        collapsed ? "w-[72px]" : "w-[248px]",
      )}
    >
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <Users className={cn("size-5 shrink-0", collapsed ? "text-primary" : "text-sidebar-foreground")} />
        {!collapsed && (
          <>
            <span className="text-sm font-semibold text-sidebar-foreground truncate flex-1">Agents</span>
            <span className="text-[11px] text-muted-foreground">{agents.length}</span>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="p-2 border-b border-sidebar-border shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search agents…"
              className="w-full h-8 pl-7 pr-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-0.5">
        {filtered.map((a) => {
          const active = pathname === `/admission/agents/${a.id}`;
          const initials = a.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("");

          return (
            <Link
              key={a.id}
              to="/admission/agents/$id"
              params={{ id: a.id }}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60",
              )}
            >
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "rounded-full grid place-items-center font-semibold text-[11px] shrink-0",
                    active
                      ? "bg-primary text-primary-foreground size-8"
                      : "bg-sidebar-accent text-sidebar-accent-foreground size-8",
                  )}
                >
                  {initials}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-sidebar",
                    statusDot(a.status),
                  )}
                />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight truncate">
                    {a.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Star className="size-2.5 fill-warning text-warning" />
                    <span>{a.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span className="truncate">{a.team}</span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
        {filtered.length === 0 && !collapsed && (
          <div className="text-xs text-muted-foreground px-2 py-3 text-center">
            No agents found.
          </div>
        )}
      </nav>

      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-20 size-6 rounded-full bg-card border border-border shadow-soft grid place-items-center hover:bg-accent transition"
        aria-label="Toggle agent sidebar"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>
    </aside>
  );
}
