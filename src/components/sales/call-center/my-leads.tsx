import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";

import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMyLeads, updateLeadStatus, logLeadCall, listAgents, selectAgent } from "./data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, Mail, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";



import { LEAD_STATUSES as STATUSES, STATUS_COLORS, STATUS_LABELS } from "./lead-outcomes";


export function AgentLeadsPage() {
  const qc = useQueryClient();
  const [agentId, setAgentId] = useState("");
  const { data: agents } = useSuspenseQuery({ queryKey: ["call-center", "agents"], queryFn: listAgents });
  const fetchLeads = listMyLeads;
  const doUpdate = updateLeadStatus;
  const doLogCall = logLeadCall;
  const { data: leads } = useSuspenseQuery({ queryKey: ["call-center", "leads", "mine", agentId], queryFn: () => { selectAgent(agentId); return fetchLeads(); } });

  const mut = useMutation({
    mutationFn: (v: { leadId: string; status: (typeof STATUSES)[number] }) =>
      doUpdate({ data: v }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["call-center"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = STATUSES.map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length }));

  return (
    <div className="space-y-6"><select aria-label="View agent leads" value={agentId} className="h-9 max-w-full rounded-md border border-border bg-card px-3" onChange={e => { setAgentId(e.target.value); selectAgent(e.target.value); qc.invalidateQueries({queryKey: ["call-center", "leads"]}); }}><option value="">All agents</option>{agents.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}</select>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.status}
            className="rounded-lg border border-border bg-card p-4 shadow-sm  "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ">
              {STATUS_LABELS[s.status]}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground ">{s.count}</p>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-16 text-center shadow-sm  ">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-primary   text-primary-foreground shadow-md">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground ">No leads yet</h3>
          <p className="mt-1 text-sm text-muted-foreground ">
            Leads uploaded or assigned by an admin will appear here.

          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <div
              key={l.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:shadow-md  "
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground ">{l.name}</h3>
                    {l.assigned_to === null && (
                      <span className="rounded-full bg-warning px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning-foreground  ">
                        Unassigned
                      </span>
                    )}
                    {l.source && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground  ">
                        {l.source}
                      </span>
                    )}
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        STATUS_COLORS[l.status] ?? "bg-muted text-foreground",
                      )}
                    >
                      {STATUS_LABELS[l.status as keyof typeof STATUS_LABELS] ?? l.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground ">
                    {l.phone && (
                      <a
                        href={`tel:${l.phone.replace(/[^+\d]/g, "")}`}
                        aria-label={`Call ${l.name} at ${l.phone}`}
                        onClick={() => {
                          doLogCall({ data: { leadId: l.id } })
                            .then(() => qc.invalidateQueries({ queryKey: ["call-center"] }))
                            .catch((error: Error) => toast.error(error.message));
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary   px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition active:scale-95 hover:shadow-lg hover:brightness-110"
                      >
                        <Phone className="h-4 w-4" /> Call {l.phone}
                      </a>
                    )}
                    {l.email && (
                      <a
                        href={`mailto:${l.email}`}
                        aria-label={`Email ${l.name}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary  :border-primary/50 :text-primary"
                      >
                        <Mail className="h-4 w-4" /> Email
                      </a>
                    )}
                  </div>
                  {l.notes && (
                    <p className="mt-3 text-sm text-muted-foreground ">{l.notes}</p>
                  )}
                </div>
                <Select
                  value={l.status}
                  onValueChange={(v) =>
                    mut.mutate({ leadId: l.id, status: v as (typeof STATUSES)[number] })
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
