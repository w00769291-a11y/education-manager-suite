// @ts-nocheck — imported from another project with looser type settings
// Lightweight client-side store for the Sales module.
// Persists agents, leads, calls, and assignments to localStorage and
// exposes a tiny pub/sub for React via useSyncExternalStore.

import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/local-app-state";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  joined: string;
  rating: number; // 0-5
  status: "Active" | "On call" | "Offline";
  avatar?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  interest: string;
  status: "New" | "Contacted" | "Qualified" | "Won" | "Lost";
  value: number; // potential sale value
  agentId?: string;
  uploadedAt: string;
};

export type Call = {
  id: string;
  leadId: string;
  agentId: string;
  outcome: "Connected" | "Voicemail" | "No answer" | "Won" | "Lost";
  duration: number; // seconds
  at: string; // ISO
  notes?: string;
};

type State = {
  agents: Agent[];
  leads: Lead[];
  calls: Call[];
};

const KEY = "edusphere.sales.v1";

const seed: State = {
  agents: [
    { id: "AG-101", name: "Aanya Kapoor", email: "aanya@edusphere.io", phone: "+91 98100 11102", team: "Inside Sales", joined: "2025-09-12", rating: 4.7, status: "Active" },
    { id: "AG-102", name: "Rohan Verma", email: "rohan@edusphere.io", phone: "+91 98100 11103", team: "Inside Sales", joined: "2025-11-04", rating: 4.3, status: "On call" },
    { id: "AG-103", name: "Priya Sharma", email: "priya@edusphere.io", phone: "+91 98100 11104", team: "Field", joined: "2026-01-18", rating: 4.9, status: "Active" },
    { id: "AG-104", name: "Karan Mehta", email: "karan@edusphere.io", phone: "+91 98100 11105", team: "Field", joined: "2026-02-02", rating: 3.8, status: "Offline" },
  ],
  leads: [
    { id: "LD-9001", name: "Rajesh Iyer", phone: "+91 99000 21001", email: "rajesh@parent.in", source: "Website", interest: "Grade 6", status: "Qualified", value: 65000, agentId: "AG-101", uploadedAt: "2026-05-21" },
    { id: "LD-9002", name: "Meera Joshi", phone: "+91 99000 21002", email: "meera@parent.in", source: "Facebook", interest: "KG-2", status: "Contacted", value: 52000, agentId: "AG-102", uploadedAt: "2026-05-22" },
    { id: "LD-9003", name: "Sandeep Roy", phone: "+91 99000 21003", email: "sandeep@parent.in", source: "Referral", interest: "Grade 9", status: "Won", value: 88000, agentId: "AG-103", uploadedAt: "2026-05-20" },
    { id: "LD-9004", name: "Anita Desai", phone: "+91 99000 21004", email: "anita@parent.in", source: "Google Ads", interest: "Grade 4", status: "New", value: 54000, agentId: "AG-101", uploadedAt: "2026-05-23" },
    { id: "LD-9005", name: "Vinay Kumar", phone: "+91 99000 21005", email: "vinay@parent.in", source: "Walk-in", interest: "Grade 11", status: "Lost", value: 99000, agentId: "AG-104", uploadedAt: "2026-05-19" },
    { id: "LD-9006", name: "Sneha Pillai", phone: "+91 99000 21006", email: "sneha@parent.in", source: "Website", interest: "Grade 7", status: "Won", value: 72000, agentId: "AG-103", uploadedAt: "2026-05-18" },
    { id: "LD-9007", name: "Hari Menon", phone: "+91 99000 21007", email: "hari@parent.in", source: "Instagram", interest: "Grade 2", status: "Qualified", value: 48000, agentId: "AG-102", uploadedAt: "2026-05-23" },
  ],
  calls: [
    { id: "C-1", leadId: "LD-9001", agentId: "AG-101", outcome: "Connected", duration: 312, at: "2026-05-23T10:24:00Z" },
    { id: "C-2", leadId: "LD-9002", agentId: "AG-102", outcome: "Voicemail", duration: 14, at: "2026-05-23T10:41:00Z" },
    { id: "C-3", leadId: "LD-9003", agentId: "AG-103", outcome: "Won", duration: 542, at: "2026-05-23T11:02:00Z" },
    { id: "C-4", leadId: "LD-9004", agentId: "AG-101", outcome: "No answer", duration: 8, at: "2026-05-23T11:18:00Z" },
    { id: "C-5", leadId: "LD-9005", agentId: "AG-104", outcome: "Lost", duration: 188, at: "2026-05-23T11:33:00Z" },
    { id: "C-6", leadId: "LD-9006", agentId: "AG-103", outcome: "Won", duration: 421, at: "2026-05-23T11:49:00Z" },
    { id: "C-7", leadId: "LD-9007", agentId: "AG-102", outcome: "Connected", duration: 256, at: "2026-05-23T12:05:00Z" },
  ],
};

function load(): State {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as State;
  } catch {
    return seed;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

let cloudTimer: ReturnType<typeof setTimeout> | null = null;
function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    if (cloudTimer) clearTimeout(cloudTimer);
    cloudTimer = setTimeout(async () => {
      await supabase.from("app_state").upsert({ key: KEY, value: state as never, updated_by: null, updated_at: new Date().toISOString() });
    }, 600);
  }
  listeners.forEach((l) => l());
}

// Pull the shared copy from the cloud once in the browser.
if (typeof window !== "undefined") {
  supabase.from("app_state").select("value").eq("key", KEY).maybeSingle().then(({ data }) => {
    if (data) {
      state = data.value as State;
      window.localStorage.setItem(KEY, JSON.stringify(state));
      listeners.forEach((l) => l());
    }
  });
}

function set(updater: (s: State) => State) {
  state = updater(state);
  persist();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => state;
const getServerSnapshot = () => seed;

export function useSales() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Raw state access for non-React modules (e.g. the call-center data layer),
// so agents added in Admission > Agents also appear in the Call Center.
export const getSalesState = () => (typeof window === "undefined" ? seed : state);

const nextId = (prefix: string, list: { id: string }[]) => {
  const nums = list
    .map((x) => parseInt(x.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `${prefix}-${max + 1}`;
};

export const salesActions = {
  addAgent(input: Omit<Agent, "id" | "joined" | "rating" | "status"> & { team?: string }) {
    set((s) => ({
      ...s,
      agents: [
        ...s.agents,
        {
          id: nextId("AG", s.agents),
          name: input.name,
          email: input.email,
          phone: input.phone,
          team: input.team || "Inside Sales",
          joined: new Date().toISOString().slice(0, 10),
          rating: 0,
          status: "Active",
        },
      ],
    }));
  },
  uploadLeads(rows: Array<Omit<Lead, "id" | "uploadedAt" | "status">>, defaultAgentId?: string) {
    set((s) => {
      const created: Lead[] = [];
      let acc = s.leads;
      for (const r of rows) {
        const id = nextId("LD", [...acc, ...created]);
        created.push({
          id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          source: r.source || "Upload",
          interest: r.interest || "—",
          status: "New",
          value: r.value || 0,
          agentId: r.agentId || defaultAgentId,
          uploadedAt: new Date().toISOString().slice(0, 10),
        });
      }
      return { ...s, leads: [...acc, ...created] };
    });
  },
  assignLead(leadId: string, agentId: string) {
    set((s) => ({
      ...s,
      leads: s.leads.map((l) => (l.id === leadId ? { ...l, agentId } : l)),
    }));
  },
  reset() {
    state = seed;
    persist();
  },
};

// Derived helpers
export function agentStats(state: State, agentId: string) {
  const leads = state.leads.filter((l) => l.agentId === agentId);
  const calls = state.calls.filter((c) => c.agentId === agentId);
  const won = leads.filter((l) => l.status === "Won");
  const lost = leads.filter((l) => l.status === "Lost");
  const revenue = won.reduce((sum, l) => sum + l.value, 0);
  const closed = won.length + lost.length;
  const winRate = closed ? Math.round((won.length / closed) * 100) : 0;
  return {
    leads: leads.length,
    calls: calls.length,
    won: won.length,
    lost: lost.length,
    revenue,
    winRate,
  };
}
