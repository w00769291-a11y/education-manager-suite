// @ts-nocheck — imported from another project with looser type settings
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, Search } from "lucide-react";
import { Section } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSales, salesActions, type Lead } from "@/lib/sales-store";
import { SendApplication } from "@/components/sales/admissions/workspace";

export const Route = createFileRoute("/admission/leads")({
  component: LeadPool,
});

function LeadPool() {
  const { leads, agents } = useSales();
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [assignTo, setAssignTo] = useState<string>(agents[0]?.id ?? "");

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()),
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result || ""));
      salesActions.uploadLeads(rows, assignTo || undefined);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <Section
        title="Lead pool"
        action={
          <div className="flex items-center gap-2">
            <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className="h-8 rounded-md border border-border bg-card px-2 text-xs">
              <option value="">Unassigned</option>
              {agents.map((a) => <option key={a.id} value={a.id}>Assign to {a.name}</option>)}
            </select>
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-1.5">
              <Upload className="size-3.5" /> Upload CSV
            </Button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleUpload} />
          </div>
        }
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] text-muted-foreground">
            Uploaded leads automatically appear in the selected agent's panel.
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads" className="h-8 pl-8 text-xs w-56" />
          </div>
        </div>
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Lead</th>
                <th className="px-3 py-3 text-left font-medium">Source</th>
                <th className="px-3 py-3 text-left font-medium">Interest</th>
                <th className="px-3 py-3 text-right font-medium">Value</th>
                <th className="px-3 py-3 text-left font-medium">Status</th>
                <th className="px-3 py-3 text-left font-medium">Application form</th>
                <th className="px-5 py-3 text-left font-medium">Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-5 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground">{l.email} · {l.phone}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{l.source}</td>
                  <td className="px-3 py-3 text-muted-foreground">{l.interest}</td>
                  <td className="px-3 py-3 text-right tabular-nums">₹{l.value.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{l.status}</span>
                  </td>
                  <td className="px-3 py-3">
                    <SendApplication lead={l} />
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={l.agentId ?? ""}
                      onChange={(e) => salesActions.assignLead(l.id, e.target.value)}
                      className="h-7 rounded-md border border-border bg-card px-1.5 text-xs"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No leads in the pool.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="CSV format">
        <div className="text-xs text-muted-foreground">
          Header row must include any of: <code className="px-1 rounded bg-secondary">name, phone, email, source, interest, value</code>.
          Example:
        </div>
        <pre className="mt-2 text-[11px] bg-secondary/60 border border-border rounded-md p-3 overflow-x-auto">{`name,phone,email,source,interest,value
Ravi Kumar,+91 99999 11111,ravi@parent.in,Website,Grade 6,58000
Sita Devi,+91 99999 22222,sita@parent.in,Referral,KG-2,52000`}</pre>
      </Section>
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
