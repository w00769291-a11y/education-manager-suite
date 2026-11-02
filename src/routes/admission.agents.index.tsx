// @ts-nocheck — imported from another project with looser type settings
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Plus, Search, Star, Upload, X, Phone, Mail, Users } from "lucide-react";
import { Section } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSales, salesActions, agentStats, type Lead } from "@/lib/sales-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admission/agents/")({
  component: AgentsIndex,
});

function AgentsIndex() {
  const state = useSales();
  const { agents } = state;
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(
    () => agents.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
    [agents, q],
  );

  const handleAgentClick = (id: string) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      navigate({ to: "/admission/agents/$id", params: { id } });
      return;
    }
    clickTimer.current = setTimeout(() => {
      setSelectedId(id);
      clickTimer.current = null;
    }, 220);
  };

  return (
    <div className="space-y-4">
      <Section
        title="Agents"
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agent" className="h-8 pl-8 text-xs w-56" />
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
              <Plus className="size-4" /> Add agent
            </Button>
          </div>
        }
      >
        <div className="text-[11px] text-muted-foreground mb-3">
          Single-click an agent to view quick history & rating. Double-click to open the full analysis report.
        </div>
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm select-none">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Agent</th>
                <th className="px-3 py-3 text-left font-medium">Team</th>
                <th className="px-3 py-3 text-right font-medium">Leads</th>
                <th className="px-3 py-3 text-right font-medium">Won</th>
                <th className="px-3 py-3 text-right font-medium">Revenue</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const s = agentStats(state, a.id);
                return (
                  <tr
                    key={a.id}
                    onClick={() => handleAgentClick(a.id)}
                    className="border-t border-border hover:bg-secondary/40 cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/15 text-primary text-xs font-bold grid place-items-center">
                          {a.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="text-[11px] text-muted-foreground">{a.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{a.team}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{s.leads}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{s.won}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">₹{s.revenue.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded",
                        a.status === "Active" ? "bg-success/10 text-success"
                          : a.status === "On call" ? "bg-warning/15 text-warning-foreground"
                          : "bg-muted text-muted-foreground",
                      )}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Star className="size-3 fill-warning text-warning" /> {a.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No agents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {showAdd && <AddAgentDialog onClose={() => setShowAdd(false)} />}
      {selectedId && <AgentDrawer agentId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function AddAgentDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [team, setTeam] = useState("Inside Sales");

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    salesActions.addAgent({ name: name.trim(), email: email.trim(), phone: phone.trim(), team });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl shadow-card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Add new agent</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            ["Full name", name, setName, "Aanya Kapoor"],
            ["Email", email, setEmail, "name@edusphere.io"],
            ["Phone", phone, setPhone, "+91 ..."],
          ].map(([l, v, sv, ph]) => (
            <div key={l as string} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{l as string}</label>
              <Input value={v as string} onChange={(e) => (sv as (s: string) => void)(e.target.value)} placeholder={ph as string} className="h-9 text-sm" />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Team</label>
            <select value={team} onChange={(e) => setTeam(e.target.value)} className="w-full h-9 rounded-md border border-border bg-card px-2 text-sm">
              <option>Inside Sales</option>
              <option>Field</option>
              <option>Pre-sales</option>
            </select>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={submit} className="gap-1.5"><Plus className="size-4" /> Create agent</Button>
        </div>
      </div>
    </div>
  );
}

function AgentDrawer({ agentId, onClose }: { agentId: string; onClose: () => void }) {
  const state = useSales();
  const agent = state.agents.find((a) => a.id === agentId);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!agent) return null;
  const s = agentStats(state, agentId);
  const agentLeads = state.leads.filter((l) => l.agentId === agentId);
  const agentCalls = state.calls.filter((c) => c.agentId === agentId);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const rows = parseCsv(text);
      salesActions.uploadLeads(rows, agentId);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const addSampleLead = () => {
    const n = agentLeads.length + 1;
    salesActions.uploadLeads(
      [{
        name: `Sample Lead ${n}`,
        phone: "+91 90000 00000",
        email: `lead${n}@parent.in`,
        source: "Manual",
        interest: "Grade 5",
        value: 50000,
      }],
      agentId,
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-card overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card">
          <h3 className="text-sm font-semibold">Agent quick view</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/15 text-primary text-sm font-bold grid place-items-center">
              {agent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{agent.name}</div>
              <div className="text-xs text-muted-foreground truncate">{agent.team} · joined {agent.joined}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs">
                <Star className="size-3 fill-warning text-warning" /> {agent.rating.toFixed(1)} rating
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /> {agent.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /> {agent.phone}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ["Leads", s.leads], ["Calls", s.calls], ["Won", s.won], ["Win %", `${s.winRate}%`],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-lg border border-border bg-secondary/40 p-2.5">
                <div className="text-[10px] uppercase text-muted-foreground">{l}</div>
                <div className="text-base font-semibold">{v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium"><Upload className="size-4 text-primary" /> Upload leads to this agent</div>
            <p className="text-[11px] text-muted-foreground mt-1">CSV columns: name, phone, email, source, interest, value</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-1.5">
                <Upload className="size-3.5" /> Upload CSV
              </Button>
              <Button size="sm" onClick={addSampleLead} className="gap-1.5">
                <Plus className="size-3.5" /> Add sample
              </Button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleUpload} />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent call history</div>
            <ul className="divide-y divide-border">
              {agentCalls.slice(-5).reverse().map((c) => {
                const lead = state.leads.find((l) => l.id === c.leadId);
                return (
                  <li key={c.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{lead?.name ?? c.leadId}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(c.at).toLocaleString()}</div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded",
                      c.outcome === "Won" ? "bg-success/10 text-success"
                        : c.outcome === "Lost" ? "bg-destructive/10 text-destructive"
                        : "bg-secondary text-secondary-foreground",
                    )}>{c.outcome}</span>
                  </li>
                );
              })}
              {agentCalls.length === 0 && <li className="py-3 text-xs text-muted-foreground">No calls yet.</li>}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assigned leads ({agentLeads.length})</div>
            <ul className="divide-y divide-border">
              {agentLeads.slice(-5).reverse().map((l) => (
                <li key={l.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground">{l.source} · {l.interest}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{l.status}</span>
                </li>
              ))}
              {agentLeads.length === 0 && <li className="py-3 text-xs text-muted-foreground">No leads assigned.</li>}
            </ul>
          </div>

          <Button className="w-full gap-1.5" onClick={() => navigate({ to: "/admission/agents/$id", params: { id: agentId } })}>
            <Users className="size-4" /> Open full analysis
          </Button>
        </div>
      </aside>
    </div>
  );
}

function parseCsv(text: string): Array<Omit<Lead, "id" | "uploadedAt" | "status">> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (k: string) => header.indexOf(k);
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      name: cols[idx("name")] || cols[0] || "Untitled",
      phone: cols[idx("phone")] || "",
      email: cols[idx("email")] || "",
      source: cols[idx("source")] || "Upload",
      interest: cols[idx("interest")] || "—",
      value: Number(cols[idx("value")] || 0) || 0,
    };
  });
}
