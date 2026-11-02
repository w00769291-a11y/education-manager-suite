// @ts-nocheck — imported from another project with looser type settings
import { supabase } from '@/lib/local-app-state';
// Agents share one store with the Admission > Agents page (sales-store), so an
// agent created in either place shows up in both.
import { getSalesState, salesActions, type Agent as SalesAgent } from '@/lib/sales-store';
import type { LeadStatus } from './lead-outcomes';

const toAgent = (a: SalesAgent): Agent => ({ id: a.id, full_name: a.name, email: a.email, created_at: a.joined, roles: ['agent'] });
const sharedAgents = () => getSalesState().agents.map(toAgent);

export const KEY = 'edusphere.sales.call-center.v1';
export type Agent = { id: string; full_name: string; email: string; created_at: string; roles: string[] };
export type Lead = { id: string; name: string; phone: string | null; email: string | null; source: string | null; notes: string | null; status: LeadStatus; assigned_to: string | null; created_at: string; updated_at: string; reason?: string | null; reason_at?: string | null };
export type Message = { id: string; sender_name: string; body: string; created_at: string };
export type State = { leads: Lead[]; agents: Agent[]; messages: Message[] };
export const EMPTY: State = { leads: [], agents: [], messages: [] };
let selectedAgent = '';
export function selectAgent(id: string) { selectedAgent = id; }
export async function read(): Promise<State> {
  const { data, error } = await supabase.from('app_state').select('value').eq('key', KEY).maybeSingle();
  if (error) throw new Error('Call-center data could not be loaded. Please try again.');
  return data ? data.value as unknown as State : { leads: [], agents: [], messages: [] };
}
let pending: Promise<unknown> = Promise.resolve();
export function change<T>(fn: (state: State) => T): Promise<T> {
  const operation = pending.catch(() => undefined).then(async () => {
    const state = await read();
    const result = fn(state);
    const { error } = await supabase.from('app_state').upsert({ key: KEY, value: state as never, updated_by: null, updated_at: new Date().toISOString() });
    if (error) throw new Error('Changes could not be saved. Please try again.');
    return result;
  });
  pending = operation;
  return operation;
}
export const listAllLeads = async () => (await read()).leads;
export const listMyLeads = async () => (await read()).leads.filter(l => !selectedAgent || !l.assigned_to || l.assigned_to === selectedAgent);
export const listAgents = async () => sharedAgents();
export async function addAgent(input: { name: string; email: string }) {
  if (!input.name.trim()) throw new Error('Enter an agent name.');
  salesActions.addAgent({ name: input.name.trim(), email: input.email.trim(), phone: '', team: 'Inside Sales' });
}
export async function bulkInsertLeads({ data }: { data: { leads: { name: string; phone?: string | null; email?: string | null; source?: string | null; notes?: string | null }[] } }) {
  return change(s => {
    const now = new Date().toISOString();
    const rows: Lead[] = data.leads.filter(l => l.name.trim()).map(l => ({ id: crypto.randomUUID(), name: l.name.trim(), phone: l.phone ?? null, email: l.email ?? null, source: l.source ?? null, notes: l.notes ?? null, status: 'new', assigned_to: null, created_at: now, updated_at: now }));
    s.leads.push(...rows); return { count: rows.length };
  });
}
export const assignLead = ({ data }: { data: { leadId: string; agentId: string | null } }) => change(s => {
  const lead = s.leads.find(l => l.id === data.leadId);
  if (!lead) throw new Error('Lead not found.');
  if (data.agentId && !getSalesState().agents.some(a => a.id === data.agentId)) throw new Error('Agent not found.');
  lead.assigned_to = data.agentId; lead.updated_at = new Date().toISOString(); return { ok: true };
});
export const autoAssignUnassigned = ({ data }: { data: { agentId: string } }) => change(s => {
  if (!getSalesState().agents.some(a => a.id === data.agentId)) throw new Error('Agent not found.');
  const leads = s.leads.filter(l => !l.assigned_to); leads.forEach(l => { l.assigned_to = data.agentId; l.updated_at = new Date().toISOString(); }); return { count: leads.length };
});
export const deleteLead = ({ data }: { data: { leadId: string } }) => change(s => { s.leads = s.leads.filter(l => l.id !== data.leadId); return { ok: true }; });
export const clearLeads = ({ data }: { data: { scope: 'all' | 'unassigned' } }) => change(s => { const before = s.leads.length; s.leads = data.scope === 'all' ? [] : s.leads.filter(l => l.assigned_to); return { count: before - s.leads.length }; });
export const updateLeadStatus = ({ data }: { data: { leadId: string; status: LeadStatus; notes?: string } }) => change(s => {
  const l = s.leads.find(l => l.id === data.leadId); if (!l) throw new Error('Lead not found.');
  l.status = data.status; if (data.notes !== undefined) l.notes = data.notes; if (!l.assigned_to && selectedAgent) l.assigned_to = selectedAgent; l.updated_at = new Date().toISOString(); return { ok: true };
});
export const logLeadCall = ({ data }: { data: { leadId: string } }) => change(s => {
  const l = s.leads.find(l => l.id === data.leadId); if (!l) throw new Error('Lead not found.');
  l.notes = `${l.notes ? l.notes + '\n' : ''}[Call ${new Date().toLocaleString()}]`; if (!l.assigned_to && selectedAgent) l.assigned_to = selectedAgent; l.updated_at = new Date().toISOString(); return { ok: true };
});
export type ReportRow = Lead & { assigned_name: string | null };
export async function listReportLeads({ data }: { data: { from?: string | null; to?: string | null; status?: string | null; agentId?: string | null; source?: string | null } }): Promise<ReportRow[]> {
  const s = await read(); return s.leads.filter(l => (!data.from || l.created_at >= data.from) && (!data.to || l.created_at <= data.to) && (!data.status || l.status === data.status) && (!data.agentId || l.assigned_to === data.agentId) && (!data.source || l.source?.toLowerCase().includes(data.source.toLowerCase()))).map(l => ({ ...l, assigned_name: sharedAgents().find(a => a.id === l.assigned_to)?.full_name ?? null }));
}
export async function getAgentSummary() {
  const s = await read(); return getSalesState().agents.map(a => { const leads = s.leads.filter(l => l.assigned_to === a.id); const count = (status: LeadStatus) => leads.filter(l => l.status === status).length; return { agentId: a.id, name: a.name, email: a.email, total: leads.length, new: count('new'), vv: count('vv'), '48': count('48'), will: count('will'), sd: count('sd'), parents: count('parents'), lc: count('lc'), nr: count('nr'), ni: count('ni') }; });
}
export async function getAnalytics() {
  const { leads } = await read();
  const agents = sharedAgents();
  const counts = (key: 'status' | 'source') => { const map = new Map<string, number>(); leads.forEach(l => { const value = l[key] || 'Unknown'; map.set(value, (map.get(value) ?? 0) + 1); }); return [...map].map(([name, count]) => ({ name, count })); };
  const assigned = leads.filter(l => l.assigned_to).length;
  return { totals: { totalLeads: leads.length, assigned, unassigned: leads.length - assigned, workedRate: leads.length ? Math.round(leads.filter(l => l.status !== 'new').length / leads.length * 100) : 0 }, funnel: counts('status').map(v => ({ status: v.name, count: v.count })), sources: counts('source').map(v => ({ source: v.name, count: v.count })), perAgent: agents.map(a => { const rows = leads.filter(l => l.assigned_to === a.id); return { agentId: a.id, name: a.full_name, total: rows.length, contacted: rows.filter(l => l.status !== 'new').length }; }), trend: Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 29 + i); const date = d.toISOString().slice(0,10); return { date, created: leads.filter(l => l.created_at.slice(0,10) === date).length }; }) };
}
// Agent share link: agent sees only leads the admin assigned to them and records a reason/outcome.
export async function getAgentLinkData(agentId: string) {
  const s = await read();
  const agent = sharedAgents().find(a => a.id === agentId) ?? null;
  return { agent, leads: agent ? s.leads.filter(l => l.assigned_to === agentId) : [] };
}
export const submitAgentReason = ({ data }: { data: { agentId: string; leadId: string; status: LeadStatus; reason: string } }) => change(s => {
  const l = s.leads.find(l => l.id === data.leadId);
  if (!l || l.assigned_to !== data.agentId) throw new Error('This lead is not assigned to you.');
  l.status = data.status; l.reason = data.reason.trim() || null; l.reason_at = new Date().toISOString(); l.updated_at = l.reason_at;
  return { ok: true };
});
