import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";
import { useSales } from "@/lib/sales-store";
import { cn } from "@/lib/utils";

export function AgentStrip() {
  const { agents } = useSales();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollBy = (dx: number) =>
    scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  const statusDot = (s: string) =>
    s === "Active"
      ? "bg-success"
      : s === "On call"
        ? "bg-warning"
        : "bg-muted-foreground/40";

  return (
    <div className="rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agents
          </h3>
          <span className="text-[11px] text-muted-foreground">
            ({agents.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollBy(-280)}
            className="size-7 grid place-items-center rounded-md border border-border hover:bg-secondary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(280)}
            className="size-7 grid place-items-center rounded-md border border-border hover:bg-secondary"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto p-3 scroll-smooth snap-x"
        style={{ scrollbarWidth: "thin" }}
      >
        {agents.map((a) => {
          const active = pathname === `/admission/agents/${a.id}`;
          return (
            <Link
              key={a.id}
              to="/admission/agents/$id"
              params={{ id: a.id }}
              className={cn(
                "snap-start shrink-0 flex items-center gap-2.5 rounded-lg border px-3 py-2 transition",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/40 hover:bg-secondary/60",
              )}
            >
              <div className="relative">
                <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-[11px]">
                  {a.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card",
                    statusDot(a.status),
                  )}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium leading-tight truncate max-w-[120px]">
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
        {agents.length === 0 && (
          <div className="text-xs text-muted-foreground px-2 py-1">
            No agents yet. Add one from the Agents tab.
          </div>
        )}
      </div>
    </div>
  );
}
