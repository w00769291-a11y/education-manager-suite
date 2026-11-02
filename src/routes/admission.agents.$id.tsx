import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowLeft, Mail, Phone, Star, TrendingUp, Trophy, XCircle } from "lucide-react";
import { Section, StatCard } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { useSales, agentStats } from "@/lib/sales-store";

export const Route = createFileRoute("/admission/agents/$id")({
  component: AgentDetail,
});

function AgentDetail() {
  const { id } = useParams({ from: "/admission/agents/$id" });
  const state = useSales();
  const agent = state.agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="space-y-4">
        <Link to="/admission/agents" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to agents
        </Link>
        <Section title="Agent not found"><div className="text-sm text-muted-foreground">This agent no longer exists.</div></Section>
      </div>
    );
  }

  const s = agentStats(state, agent.id);
  const leads = state.leads.filter((l) => l.agentId === agent.id);
  const calls = state.calls.filter((c) => c.agentId === agent.id);

  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    d,
    calls: Math.max(2, Math.round((s.calls / 7) * (1 + Math.sin(i) * 0.4))),
    sales: Math.max(0, Math.round((s.won / 7) * (1 + Math.cos(i) * 0.6))),
  }));

  const outcome = [
    { name: "Won", value: calls.filter((c) => c.outcome === "Won").length, color: "var(--color-success)" },
    { name: "Lost", value: calls.filter((c) => c.outcome === "Lost").length, color: "var(--color-destructive)" },
    { name: "Connected", value: calls.filter((c) => c.outcome === "Connected").length, color: "var(--color-chart-1)" },
    { name: "Voicemail", value: calls.filter((c) => c.outcome === "Voicemail").length, color: "var(--color-chart-2)" },
    { name: "No answer", value: calls.filter((c) => c.outcome === "No answer").length, color: "var(--color-chart-3)" },
  ];

  const bySource = ["Website", "Facebook", "Referral", "Google Ads", "Walk-in", "Instagram", "Upload", "Manual"]
    .map((src) => ({ src, n: leads.filter((l) => l.source === src).length }))
    .filter((r) => r.n > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admission/agents" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to agents
        </Link>
        <Button size="sm" variant="outline">Export report</Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft flex flex-wrap items-center gap-4">
        <div className="size-14 rounded-full bg-primary/15 text-primary text-base font-bold grid place-items-center">
          {agent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{agent.name}</h2>
          <div className="text-xs text-muted-foreground">{agent.team} · {agent.id} · joined {agent.joined}</div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Mail className="size-3.5" /> {agent.email}</span>
            <span className="inline-flex items-center gap-1"><Phone className="size-3.5" /> {agent.phone}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 text-sm font-semibold">
            <Star className="size-4 fill-warning text-warning" /> {agent.rating.toFixed(1)}
          </div>
          <div className="text-[11px] text-muted-foreground">Performance rating</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Leads handled" value={s.leads.toString()} icon={TrendingUp} />
        <StatCard label="Calls made" value={s.calls.toString()} icon={Phone} accent="primary" />
        <StatCard label="Deals won" value={s.won.toString()} icon={Trophy} accent="success" />
        <StatCard label="Deals lost" value={s.lost.toString()} icon={XCircle} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Performance trend (last 7 days)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area isAnimationActive={false} type="monotone" dataKey="calls" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#ac)" />
                <Area isAnimationActive={false} type="monotone" dataKey="sales" stroke="var(--color-success)" strokeWidth={2.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Call outcomes">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={outcome.filter((o) => o.value > 0)} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {outcome.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Lead sources" className="lg:col-span-2">
          {bySource.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No leads assigned yet.</div>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySource}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="src" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar isAnimationActive={false} dataKey="n" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Section>
        <Section title="Revenue summary">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Total closed revenue</div>
              <div className="text-2xl font-semibold">₹{s.revenue.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Win rate</div>
              <div className="text-2xl font-semibold">{s.winRate}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg. deal size</div>
              <div className="text-2xl font-semibold">
                ₹{s.won ? Math.round(s.revenue / s.won).toLocaleString("en-IN") : 0}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section title="All assigned leads">
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Lead</th>
                <th className="px-3 py-3 text-left font-medium">Source</th>
                <th className="px-3 py-3 text-left font-medium">Interest</th>
                <th className="px-3 py-3 text-right font-medium">Value</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-5 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground">{l.phone}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{l.source}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.interest}</td>
                  <td className="px-3 py-3 text-right tabular-nums">₹{l.value.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{l.status}</span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No leads assigned to this agent.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
