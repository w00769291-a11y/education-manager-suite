import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Megaphone, UserPlus, Wallet, GraduationCap, Users, Briefcase, Settings,
  Search, Bell, PanelLeft, Plus, TrendingUp, ChevronRight, HelpCircle, Sparkles, MoreHorizontal,
  BarChart3, Activity, CircleDot, ShieldCheck, Landmark,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const menu = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Marketing", url: "/marketing", icon: Megaphone },
  { title: "Admission", url: "/admission", icon: UserPlus },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
  { title: "Academic", url: "/academic", icon: GraduationCap },
  { title: "HR", url: "/hr", icon: Users },
  { title: "Directors", url: "/directors", icon: Landmark },
  { title: "Workspace", url: "/workspace", icon: Briefcase },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;


function BackgroundArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute -right-32 -top-32 size-[480px] text-primary/10" viewBox="0 0 200 200" fill="currentColor">
        <path d="M42.7,-62.9C55.9,-52.8,67.6,-40.3,72.6,-25.4C77.6,-10.5,75.9,6.8,70.3,22.1C64.7,37.4,55.2,50.7,42.5,59.4C29.8,68.1,14.9,72.2,-0.7,73.2C-16.3,74.2,-32.6,72.1,-45.6,63.4C-58.6,54.7,-68.3,39.4,-72.5,22.7C-76.7,6,-75.4,-12.1,-68.3,-27.2C-61.2,-42.3,-48.3,-54.4,-34,-63.9C-19.7,-73.4,-3.9,-80.3,10.3,-78.3C24.5,-76.3,29.5,-73,42.7,-62.9Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute -bottom-40 -left-24 size-[420px] text-primary/[0.07]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M39.5,-54.4C52.4,-46.7,64.6,-35.6,70.4,-21.7C76.2,-7.8,75.6,8.9,69.8,23.3C64,37.7,53,49.8,39.9,58.2C26.8,66.6,11.6,71.3,-3.4,75.9C-18.4,80.5,-33.2,85,-45.4,78.6C-57.6,72.2,-67.2,54.9,-72.3,37.2C-77.4,19.5,-78,1.4,-73.1,-13.6C-68.2,-28.6,-57.8,-40.5,-45.1,-48.4C-32.4,-56.3,-17.4,-60.2,-1.8,-58C13.8,-55.8,26.6,-62.1,39.5,-54.4Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute right-24 top-40 size-40 text-primary/15" viewBox="0 0 100 100" fill="currentColor">
        {Array.from({ length: 25 }).map((_, i) => (
          <circle key={i} cx={(i % 5) * 20 + 10} cy={Math.floor(i / 5) * 20 + 10} r="2.2" />
        ))}
      </svg>
      <svg className="absolute bottom-24 left-1/3 size-28 text-primary/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="38" />
        <circle cx="50" cy="50" r="24" strokeDasharray="4 6" />
      </svg>
      <svg className="absolute left-10 top-24 h-24 w-64 text-primary/10" viewBox="0 0 256 96" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 60 C 40 20, 70 90, 106 50 S 176 10, 212 55 S 250 70, 252 40" />
        <path d="M4 78 C 40 38, 70 108, 106 68 S 176 28, 212 73 S 250 88, 252 58" opacity="0.5" />
      </svg>
      <svg className="absolute bottom-10 right-16 size-24 text-primary/15" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 70 L50 40 L80 70" />
        <path d="M20 50 L50 20 L80 50" opacity="0.5" />
      </svg>
    </div>
  );
}

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      <aside className={`${open ? "w-64" : "w-[72px]"} sticky top-0 h-screen shrink-0 bg-sidebar-gradient text-sidebar-foreground transition-all duration-300 flex flex-col`}>
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
            <GraduationCap className="size-5" />
          </div>
          {open && (
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight text-sidebar-accent-foreground">Manager Edu</p>
              <p className="text-[11px] opacity-60">School Suite</p>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {menu.map((m) => {
              const active = path === m.url;
              return (
                <Link key={m.url} to={m.url} title={m.title}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow" : "hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"}`}>
                  <m.icon className="size-[18px] shrink-0" />
                  {open && <span className="flex-1">{m.title}</span>}
                  {open && active && <ChevronRight className="size-4 opacity-70" />}
                </Link>
              );
            })}
          </div>
        </nav>
        {open && (
          <div className="m-3 rounded-xl bg-sidebar-accent/40 p-4">
            <Sparkles className="size-5 text-sidebar-accent-foreground" />
            <p className="mt-2 text-sm font-semibold text-sidebar-accent-foreground">Upgrade to Pro</p>
            <p className="mt-1 text-xs opacity-70">Unlock analytics & multi-branch.</p>
          </div>
        )}
      </aside>

      <div className="relative flex flex-1 flex-col min-w-0">
        <BackgroundArt />
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-6 backdrop-blur">
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Toggle menu">
            <PanelLeft className="size-[18px]" />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search students, staff, invoices…" className="w-full rounded-lg border bg-background py-2 pl-9 pr-14 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Help"><HelpCircle className="size-[18px]" /></button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Notifications">
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            <div className="mx-2 h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-full bg-primary-gradient text-xs font-bold text-primary-foreground">PR</div>
              <div className="hidden leading-tight lg:block">
                <p className="text-sm font-semibold">Praneeth</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main key={title} className="page-in relative z-10 flex-1 p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Home / {title}</p>
              <h1 className="text-gradient mt-1 text-2xl font-extrabold tracking-tight">{title}</h1>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">Export</button>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95">
                <Plus className="size-4" />Create new
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

const statIcons = [Users, TrendingUp, BarChart3, Activity];

export function Stat({ label, value, note, i }: { label: string; value: string; note?: string | undefined; i: number }) {
  const Icon = statIcons[i % 4]!;
  return (
    <div className="fade-up card-fx group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card" style={{ animationDelay: `${i * 90}ms` }}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></div>
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight"><CountUp value={value} /></p>
      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
        <TrendingUp className="size-3" />{note ?? "Stable"}
      </p>
    </div>
  );
}

function statusTone(v: string) {
  const s = v.toLowerCase();
  if (/(approved|running|enabled|paid)/.test(s)) return "bg-success/10 text-success";
  if (/(pending|scheduled|interview|draft)/.test(s)) return "bg-warning/15 text-warning";
  return "";
}

export function Panel({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="fade-up card-fx rounded-2xl border bg-card shadow-card" style={{ animationDelay: "250ms" }}>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-bold">{title}</p>
        <button className="rounded-md p-1 text-muted-foreground hover:bg-accent" aria-label="More"><MoreHorizontal className="size-4" /></button>
      </div>
      <ul className="px-2 pb-2">
        {rows.map(([a, b]) => {
          const tone = statusTone(b);
          return (
            <li key={a} className="row-fx flex items-center gap-3 rounded-xl px-3 py-3 text-sm">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground">{a.charAt(0)}</div>
              <span className="flex-1 font-medium">{a}</span>
              {tone ? (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{b}</span>
              ) : (
                <span className="text-muted-foreground">{b}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function chartData(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 997;
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({
    m, a: Math.round(55 + Math.sin(i * 0.9 + h) * 14 + i * 4), b: Math.round(40 + Math.cos(i * 0.8 + h) * 10 + i * 2),
  }));
}

export function ModulePage({ title, stats, panels }: { title: string; stats: [string, string, string?][]; panels: { title: string; rows: [string, string][] }[] }) {
  const data = chartData(title);
  return (
    <AppShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l, v, n], i) => <Stat key={l} label={l} value={v} note={n} i={i} />)}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="fade-up card-fx rounded-2xl border bg-card p-5 shadow-card xl:col-span-2" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{title} performance</p>
              <p className="text-xs text-muted-foreground">Last 10 months</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CircleDot className="size-3 text-primary" />This year</span>
              <span className="flex items-center gap-1"><CircleDot className="size-3 text-chart-2" />Last year</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area isAnimationActive={false} type="monotone" dataKey="b" stroke="var(--chart-2)" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                <Area isAnimationActive={false} type="monotone" dataKey="a" stroke="var(--primary)" strokeWidth={2.5} fill="url(#ga)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fade-up relative overflow-hidden rounded-2xl bg-hero-gradient p-6 text-primary-foreground shadow-glow">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-12 -left-6 size-32 rounded-full bg-primary-foreground/10" />
          <Sparkles className="relative size-6" />
          <p className="relative mt-4 text-lg font-bold">Smart insights</p>
          <p className="relative mt-2 text-sm opacity-85">
            {title} is trending up this term. Review the latest activity and plan next steps with your team.
          </p>
          <div className="relative mt-6">
            <div className="flex justify-between text-xs opacity-85"><span>Term goal</span><span>78%</span></div>
            <div className="mt-2 h-2 rounded-full bg-primary-foreground/20"><div className="h-2 w-[78%] rounded-full bg-primary-foreground" /></div>
          </div>
          <button className="relative mt-6 rounded-lg bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary">View report</button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {panels.map((p) => <Panel key={p.title} {...p} />)}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="fade-up rounded-2xl border bg-card p-5 shadow-card">
          <p className="font-bold">Distribution</p>
          <p className="text-xs text-muted-foreground">Share by category</p>
          <div className="relative mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={donut} dataKey="v" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">
                  {donut.map((d) => <Cell key={d.n} fill={d.c} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div><p className="text-2xl font-extrabold">100%</p><p className="text-xs text-muted-foreground">Total</p></div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {donut.map((d) => (
              <span key={d.n} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: d.c }} />{d.n} · {d.v}%</span>
            ))}
          </div>
        </div>

        <div className="fade-up rounded-2xl border bg-card p-5 shadow-card">
          <p className="font-bold">Recent activity</p>
          <p className="text-xs text-muted-foreground">Live updates from your team</p>
          <ol className="relative mt-4 space-y-4 border-l pl-5">
            {activity.map((a) => (
              <li key={a.t} className="relative">
                <span className="absolute -left-[27px] top-1 grid size-3.5 place-items-center rounded-full bg-primary ring-4 ring-accent" />
                <p className="text-sm font-medium">{a.t}</p>
                <p className="text-xs text-muted-foreground">{a.w}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="fade-up rounded-2xl border bg-card p-5 shadow-card">
          <p className="font-bold">Quick actions</p>
          <p className="text-xs text-muted-foreground">Shortcuts for {title}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quick.map((q) => (
              <button key={q.l} className="group flex flex-col items-start gap-2 rounded-xl border bg-background p-3 text-left transition-colors hover:border-primary hover:shadow-glow">
                <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground transition group-hover:bg-primary-gradient group-hover:text-primary-foreground"><q.i className="size-4" /></span>
                <span className="text-sm font-semibold">{q.l}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-accent p-3">
            <p className="text-xs font-semibold text-accent-foreground">Upcoming</p>
            <p className="mt-1 text-sm font-medium">Parent-teacher meeting · Nov 5, 10:00 AM</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const donut = [
  { n: "Primary", v: 42, c: "var(--primary)" },
  { n: "Secondary", v: 28, c: "var(--chart-2)" },
  { n: "Higher", v: 18, c: "var(--chart-4)" },
  { n: "Other", v: 12, c: "var(--chart-1)" },
];
const activity = [
  { t: "Fee payment received from Grade 8", w: "2 min ago · Finance" },
  { t: "New admission enquiry submitted", w: "18 min ago · Admission" },
  { t: "Exam timetable published", w: "1 hr ago · Academic" },
  { t: "Leave approved for Arjun Iyer", w: "3 hrs ago · HR" },
];
const quick = [
  { l: "Add student", i: UserPlus },
  { l: "Collect fee", i: Wallet },
  { l: "Send notice", i: Megaphone },
  { l: "Reports", i: BarChart3 },
];

function CountUp({ value }: { value: string }) {
  const m = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const [n, setN] = useState(0);
  const target = m ? parseFloat(m[2]!.replace(/,/g, "")) : 0;
  useEffect(() => {
    if (!m) return;
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0) / 1200); setN(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [value]);
  if (!m) return <>{value}</>;
  const dec = (m[2]!.split(".")[1] || "").length;
  return <>{m[1]}{n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{m[3]}</>;
}
