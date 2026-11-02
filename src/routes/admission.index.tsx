// @ts-nocheck — imported from another project with looser type settings
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Phone, TrendingUp, Users, Inbox, Activity, Star, ArrowUpRight,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { salesActions } from "@/lib/sales-store";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Section, StatCard } from "@/components/ui/page";
import { useSales, agentStats } from "@/lib/sales-store";

export const Route = createFileRoute("/admission/")({
  component: SalesDashboard,
});

const trend = [
  { d: "Mon", calls: 142, sales: 6 },
  { d: "Tue", calls: 168, sales: 9 },
  { d: "Wed", calls: 191, sales: 11 },
  { d: "Thu", calls: 176, sales: 8 },
  { d: "Fri", calls: 224, sales: 14 },
  { d: "Sat", calls: 132, sales: 5 },
  { d: "Sun", calls: 88, sales: 3 },
];

function SalesDashboard() {
  const { agents, leads, calls } = useSales();

  const totalSalesValue = leads.filter((l) => l.status === "Won").reduce((s, l) => s + l.value, 0);
  const activeAgents = agents.filter((a) => a.status !== "Offline").length;
  const leadPool = leads.filter((l) => l.status === "New" || l.status === "Contacted").length;

  const outcomeCounts = {
    Connected: calls.filter((c) => c.outcome === "Connected").length,
    Voicemail: calls.filter((c) => c.outcome === "Voicemail").length,
    "No answer": calls.filter((c) => c.outcome === "No answer").length,
    Won: calls.filter((c) => c.outcome === "Won").length,
    Lost: calls.filter((c) => c.outcome === "Lost").length,
  };
  const outcomeData = Object.entries(outcomeCounts).map(([name, value], i) => ({
    name,
    value,
    color: ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-success)", "var(--color-destructive)"][i],
  }));

  const perf = agents
    .map((a) => ({ ...agentStats({ agents, leads, calls }, a.id), id: a.id, name: a.name, rating: a.rating }))
    .sort((a, b) => b.revenue - a.revenue);

  // Live feed: rotating subset of recent calls
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 3500);
    return () => clearInterval(i);
  }, []);
  const feed = [...calls].reverse().slice(0, 6).map((c, idx) => {
    const lead = leads.find((l) => l.id === c.leadId);
    const agent = agents.find((a) => a.id === c.agentId);
    return { ...c, leadName: lead?.name ?? "—", agentName: agent?.name ?? "—", pulse: (idx + tick) % 2 === 0 };
  });

  const leadReport = ["Website", "Facebook", "Referral", "Google Ads", "Walk-in", "Instagram"].map((src) => ({
    src,
    n: leads.filter((l) => l.source === src).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total calls" value={calls.length.toString()} delta="12.4%" icon={Phone} />
        <StatCard label="Total sales" value={`₹${(totalSalesValue / 100000).toFixed(1)}L`} delta="8.1%" icon={TrendingUp} accent="success" />
        <StatCard label="Active agents" value={`${activeAgents}/${agents.length}`} icon={Users} accent="primary" />
        <StatCard label="Lead pool" value={leadPool.toString()} delta="22%" icon={Inbox} accent="warning" />
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          title="Agent performance"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-2">
              <UploadLeadsButton />
              <Link to="/admission/agents" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
          }
        >
          <div className="overflow-x-auto -m-5">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Agent</th>
                  <th className="px-3 py-3 text-right font-medium">Calls</th>
                  <th className="px-3 py-3 text-right font-medium">Leads</th>
                  <th className="px-3 py-3 text-right font-medium">Win rate</th>
                  <th className="px-3 py-3 text-right font-medium">Revenue</th>
                  <th className="px-5 py-3 text-right font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {perf.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.calls}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.leads}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.winRate}%</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">₹{p.revenue.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Star className="size-3 fill-warning text-warning" /> {p.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Outcome report">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={outcomeData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {outcomeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {outcomeData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Live feed"
          action={<span className="flex items-center gap-1.5 text-[11px] text-success font-medium"><span className="size-1.5 rounded-full bg-success animate-pulse" /> Live</span>}
        >
          <ul className="space-y-3">
            {feed.map((f) => (
              <li key={f.id} className="flex items-start gap-3 text-sm">
                <div className={`size-2 rounded-full mt-1.5 ${f.pulse ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    <span className="font-medium">{f.agentName}</span>{" "}
                    <span className="text-muted-foreground">→ {f.leadName}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {f.outcome} · {Math.round(f.duration / 60)}m {f.duration % 60}s
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Calls vs Sales (this week)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="cls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area isAnimationActive={false} type="monotone" dataKey="calls" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#cls)" />
                <Area isAnimationActive={false} type="monotone" dataKey="sales" stroke="var(--color-success)" strokeWidth={2.5} fill="url(#sls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Call & lead report by source" className="lg:col-span-2">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadReport}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="src" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar isAnimationActive={false} dataKey="n" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Top closer" action={<Activity className="size-4 text-muted-foreground" />}>
          {perf[0] && (
            <div className="rounded-lg gradient-soft p-4 border border-border/60">
              <div className="text-xs text-muted-foreground">This month</div>
              <div className="mt-1 text-lg font-semibold">{perf[0].name}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Won</div>
                  <div className="text-base font-semibold">{perf[0].won}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Calls</div>
                  <div className="text-base font-semibold">{perf[0].calls}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Revenue</div>
                  <div className="text-base font-semibold">₹{(perf[0].revenue / 1000).toFixed(0)}k</div>
                </div>
              </div>
              <Link to="/admission/agents/$id" params={{ id: perf[0].id }} className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                Full report <ArrowUpRight className="size-3" />
              </Link>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}



function UploadLeadsButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return;
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = (k: string) => headers.indexOf(k);
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        name: cols[idx("name")] || cols[0] || "Unknown",
        phone: cols[idx("phone")] || "",
        email: cols[idx("email")] || "",
        source: cols[idx("source")] || "Upload",
        interest: cols[idx("interest")] || "—",
        value: Number(cols[idx("value")] || 0) || 0,
      };
    });
    salesActions.uploadLeads(rows);
    toast.success(`Uploaded ${rows.length} lead${rows.length === 1 ? "" : "s"}`);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => inputRef.current?.click()}>
        <Upload className="size-3.5" /> Upload CSV
      </Button>
    </>
  );
}
