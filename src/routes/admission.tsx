import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AgentSideNav } from "@/components/sales/agent-sidenav";
import { AdmissionsProvider } from "@/components/sales/admissions/context";
import { RoleSwitcher } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Admission — Manager Edu" },
      { name: "description", content: "Admission pipeline: agents, leads, call center, applications and finance desk." },
      { property: "og:title", content: "Admission — Manager Edu" },
      { property: "og:description", content: "Admission pipeline: agents, leads, call center, applications and finance desk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdmissionLayout,
});

const TABS: {
  to:
    | "/admission"
    | "/admission/agents"
    | "/admission/leads"
    | "/admission/applications"
    | "/admission/finance"
    | "/admission/form-builder"
    | "/admission/call-center";
  label: string;
  exact?: boolean;
}[] = [
  { to: "/admission", label: "Dashboard", exact: true },
  { to: "/admission/agents", label: "Agents" },
  { to: "/admission/leads", label: "Lead Pool" },
  { to: "/admission/call-center", label: "Call Center" },
  { to: "/admission/applications", label: "Skill AI Admissions" },
  { to: "/admission/finance", label: "Finance Desk" },
  { to: "/admission/form-builder", label: "Form Builder" },
];

function AdmissionLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCallCenter = pathname.startsWith("/admission/call-center");
  return (
    <AppShell title="Admission">
      <AdmissionsProvider>
        <div className="space-y-6">
          <PageHeader
            title="Admission"
            subtitle="Pipeline, agents, leads and live performance"
            actions={
              <>
                <RoleSwitcher />
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="size-4" /> Export
                </Button>
                <Link to="/admission/application">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" /> New application
                  </Button>
                </Link>
              </>
            }
          />
          <div className="-mt-2 overflow-x-auto border-b border-border">
            <nav className="-mb-px flex min-w-max gap-1">
              {TABS.map((t) => {
                const active = t.exact ? pathname === t.to || pathname === t.to + "/" : pathname.startsWith(t.to);
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex">
            {!isCallCenter && <AgentSideNav />}
            <div className={cn("min-w-0 flex-1", !isCallCenter && "pl-6")}>
              <Outlet />
            </div>
          </div>
        </div>
      </AdmissionsProvider>
    </AppShell>
  );
}
