import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Search, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSales } from "@/lib/sales-store";
import { cn } from "@/lib/utils";

export function AgentMenu() {
  const { agents } = useSales();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const onDetail = pathname.startsWith("/admission/agents/");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(t) ||
        a.team.toLowerCase().includes(t),
    );
  }, [agents, q]);

  const statusDot = (s: string) =>
    s === "Active"
      ? "bg-success"
      : s === "On call"
        ? "bg-warning"
        : "bg-muted-foreground/40";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap",
            onDetail
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Users className="size-4" />
          Agent List
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-0">
        <div className="p-2 border-b border-border">
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
        <div className="max-h-80 overflow-y-auto p-1 scrollbar-thin">
          {filtered.map((a) => {
            const active = pathname === `/admission/agents/${a.id}`;
            return (
              <Link
                key={a.id}
                to="/admission/agents/$id"
                params={{ id: a.id }}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-2 transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/60 text-foreground",
                )}
              >
                <div className="relative shrink-0">
                  <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-[11px]">
                    {a.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-popover",
                      statusDot(a.status),
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium leading-tight truncate">
                    {a.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="size-2.5 fill-warning text-warning" />
                    <span>{a.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span className="truncate">{a.team}</span>
                  </div>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-xs text-muted-foreground px-2 py-3 text-center">
              No agents found.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
