import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useSales } from "@/lib/sales-store";
import { cn } from "@/lib/utils";

export function AgentNavBar() {
  const { agents } = useSales();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollRef = useRef<HTMLDivElement>(null);

  const statusRing = (s: string) =>
    s === "Active"
      ? "ring-emerald-500"
      : s === "On call"
        ? "ring-amber-500"
        : "ring-muted-foreground/30";

  const statusDot = (s: string) =>
    s === "Active"
      ? "bg-emerald-500"
      : s === "On call"
        ? "bg-amber-500"
        : "bg-muted-foreground/40";

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agents</div>
          <div className="text-[11px] text-muted-foreground">Tap an agent to view performance & analysis</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-thin px-4 py-3 scroll-smooth"
      >
        {agents.map((a) => {
          const active = pathname === `/admission/agents/${a.id}`;
          const initials = a.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
          return (
            <Link
              key={a.id}
              to="/admission/agents/$id"
              params={{ id: a.id }}
              className={cn(
                "group flex flex-col items-center gap-1.5 shrink-0 w-20 select-none",
              )}
              title={`${a.name} · ${a.team}`}
            >
              <div className="relative">
                <div
                  className={cn(
                    "size-14 rounded-full grid place-items-center text-sm font-bold ring-2 ring-offset-2 ring-offset-card transition",
                    active
                      ? "bg-primary text-primary-foreground ring-primary scale-105"
                      : cn("bg-primary/10 text-primary", statusRing(a.status)),
                  )}
                >
                  {initials}
                </div>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
                    statusDot(a.status),
                  )}
                />
              </div>
              <div
                className={cn(
                  "text-[11px] text-center leading-tight truncate w-full",
                  active ? "text-primary font-semibold" : "text-foreground",
                )}
              >
                {a.name.split(" ")[0]}
              </div>
              <div className="text-[10px] text-muted-foreground -mt-1 truncate w-full text-center">
                {a.team}
              </div>
            </Link>
          );
        })}

        {agents.length === 0 && (
          <span className="text-xs text-muted-foreground px-2 py-4">No agents yet.</span>
        )}
      </div>
    </div>
  );
}
