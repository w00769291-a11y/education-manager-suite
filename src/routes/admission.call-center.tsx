import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Suspense } from "react";
import { Headset } from "lucide-react";
import { CALL_CENTER_PAGES } from "@/components/sales/call-center/navigation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admission/call-center")({ component: CallCenterLayout });

function CallCenterLayout() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  return <section className="space-y-5 min-w-0">
    <h2 className="flex items-center gap-2 text-xl font-semibold"><Headset className="size-5 text-primary" />Call Center</h2>
    <nav aria-label="Call Center" className="flex flex-wrap gap-1 border-b border-border">
      {CALL_CENTER_PAGES.map(page => <Link key={page.to} to={page.to} className={cn("border-b-2 px-3 py-2 text-sm font-medium", pathname === page.to ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{page.label}</Link>)}
    </nav>
    <Suspense fallback={<div role="status" className="py-12 text-center text-muted-foreground">Loading call-center records…</div>}><Outlet /></Suspense>
  </section>;
}