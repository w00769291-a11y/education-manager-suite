// @ts-nocheck — imported from another project with looser type settings
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/local-app-state';
import { toast } from 'sonner';
import { INITIAL, createApplication, dossierErrors, type AdmissionsState, type Application, type Dossier, type Role, ROLES } from './model';

const KEY = 'edusphere.sales.skill-ai.v1';
type Store = { state: AdmissionsState; ready: boolean; role: Role; setRole: (role: Role) => void; update: (fn: (state: AdmissionsState) => AdmissionsState) => void; submit: (d: Dossier) => string | undefined; patch: (id: string, fn: (app: Application) => Application) => void };
const Context = createContext<Store | null>(null);
export function AdmissionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(INITIAL), [ready, setReady] = useState(false), [role, setRole] = useState<Role>(ROLES[0]);
  const dirty = useRef(false);
  useEffect(() => {
    let cancelled = false;
    try { const cached = localStorage.getItem(KEY); if (cached) setState(JSON.parse(cached)); } catch { /* use initial state */ }
    supabase.from('app_state').select('value').eq('key', KEY).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (data) { setState(data.value as unknown as AdmissionsState); localStorage.setItem(KEY, JSON.stringify(data.value)); }
      if (error) toast.error('Cloud data could not be loaded. Your saved local copy is available.');
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!ready || !dirty.current) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    const timer = setTimeout(() => { supabase.from('app_state').upsert({ key: KEY, value: state as never, updated_by: null, updated_at: new Date().toISOString() }).then(({ error }) => { if (error) toast.error('Saved on this device; cloud saving failed.'); }); }, 300);
    return () => clearTimeout(timer);
  }, [state, ready]);
  const update = (fn: (s: AdmissionsState) => AdmissionsState) => { if (!ready) return; dirty.current = true; setState(fn); };
  const submit = (d: Dossier) => {
    const errors = dossierErrors(d, state.config);
    if (!ready || errors.length) { toast.error(errors[0] ?? 'Please wait for saved data'); return; }
    const app = createApplication(d, state.config.courses.find(c => c.name === d.course)?.fee ?? 0);
    update(s => ({ ...s, applications: [...s.applications, app], students: [...s.students, { id: app.studentId, name: d.name, email: d.email, mobile: d.mobile }] }));
    toast.success('Application submitted. Finance: Pending Verification.'); return app.id;
  };
  return <Context.Provider value={{ state, ready, role, setRole, update, submit, patch: (id, fn) => update(s => ({ ...s, applications: s.applications.map(a => a.id === id ? fn(a) : a) })) }}>{children}</Context.Provider>;
}
export function useAdmissions() { const value = useContext(Context); if (!value) throw new Error('AdmissionsProvider is required'); return value; }
