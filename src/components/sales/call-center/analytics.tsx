import { Button } from "@/components/ui/button";
import { Suspense } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getAnalytics } from "./data";
import { STATUS_LABELS, STATUS_COLORS } from "./lead-outcomes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Users, Target, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";



const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)", "var(--color-chart-1)"];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 shadow-sm  ",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", accent)}>
          <Icon size={20} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground ">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground ">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export function AnalyticsPage() {
  const fetchAnalytics = getAnalytics;
  const { data } = useSuspenseQuery({
    queryKey: ["call-center", "analytics"],
    queryFn: () => fetchAnalytics(),
  });

  const funnelData = data.funnel.map((f) => ({
    ...f,
    label: STATUS_LABELS[f.status as keyof typeof STATUS_LABELS] ?? f.status,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={data.totals.totalLeads}
          accent="bg-primary  "
        />
        <StatCard
          icon={Target}
          label="Assigned"
          value={data.totals.assigned}
          accent="bg-primary  "
        />
        <StatCard
          icon={PhoneOff}
          label="Unassigned"
          value={data.totals.unassigned}
          accent="bg-primary  "
        />
        <StatCard
          icon={TrendingUp}
          label="Worked Rate"
          value={`${data.totals.workedRate}%`}
          accent="bg-primary  "
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-foreground ">
            Lead Funnel by Status
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-1)" />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="count" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {funnelData.map((f) => (
              <span
                key={f.status}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_COLORS[f.status] ?? "bg-muted text-foreground",
                )}
              >
                {f.label}: {f.count}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-foreground ">
            Source Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sources}
                  dataKey="count"
                  nameKey="source"
                  outerRadius={90}
                  label={(props: { name?: string; value?: number }) =>
                    `${props.name ?? ""} (${props.value ?? 0})`
                  }
                >
                  {data.sources.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-foreground ">
          Trend — Last 30 Days
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-1)" />
              <XAxis
                dataKey="date"
                fontSize={11}
                tickFormatter={(d: string) => d.slice(5)}
              />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line isAnimationActive={false} type="monotone" dataKey="created" stroke="var(--color-chart-1)" name="Leads created" strokeWidth={2} />
              
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-foreground ">
          Per-Agent Performance
        </h3>
        {data.perAgent.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No assigned leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground  ">
                <tr>
                  <th className="p-3 text-left font-semibold">Agent</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-right font-semibold">Contacted</th>
                  
                  
                  <th className="p-3 text-right font-semibold">Worked</th>
                </tr>
              </thead>
              <tbody>
                {data.perAgent.map((a) => {
                  const rate = a.total ? Math.round((a.contacted / a.total) * 100) : 0;
                  return (
                    <tr
                      key={a.agentId}
                      className="border-t border-border "
                    >
                      <td className="p-3 font-medium text-foreground ">
                        {a.name}
                      </td>
                      <td className="p-3 text-right">{a.total}</td>
                      <td className="p-3 text-right">{a.contacted}</td>
                      
                      
                      <td className="p-3 text-right font-semibold">{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
