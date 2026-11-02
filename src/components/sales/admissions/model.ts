// @ts-nocheck — imported from another project with looser type settings
import { differenceInYears, parseISO } from 'date-fns';

export const ROLES = ['Sales Representative (Marcus Vance)', 'Sales Manager (Elena Rostova)', 'Finance Officer (Priya Patel)', 'Admin (David Sterling)'] as const;
export type Role = typeof ROLES[number];
export const SOURCES = ['Walk-in', 'Google Search', 'Instagram', 'Facebook', 'YouTube', 'Skill AI Website', 'Banner / Hoarding', 'WhatsApp', 'Justdial', 'UrbanPro', 'Friend', 'Family', 'Student', 'Alumni', 'College / Institution', 'Event', 'Seminar', 'Other'];
export const DOCUMENTS = ['ID proof (Aadhaar / Passport / Government Photo ID)', 'Address proof (Electricity Bill / Voter ID / Passport)', 'Latest marksheet (Degree / Diploma / 12th Certificate)', 'Two passport-size photographs attached', 'TC (Transfer Certificate)'];
export const SECTIONS = ['Personal details', 'Guardian details', 'Educational qualification / Work exp', 'Lead source & reference', 'Course preference', 'Documents enclosed', 'Declaration', 'For office use only'];
export const DECLARATION = 'I declare that the information given in this form is true and correct. I agree to follow the rules and regulations of Skill AI and understand that admission is subject to written approval.';
export const COURSES = ['Full Stack AI & Web Engineering', 'Data Science & Machine Learning', 'Generative AI & Agentic Systems', 'Cloud Architecture & DevOps', 'Python Automation'];
export const PLANS = ['Full Upfront Payment', 'Standard Instalment Plan', 'Scholarship / Concession Plan'];
export type Qualification = { id: string; role: string; institute: string; year: string; grade: string };
export type Attachment = { name: string; data: string; checked: boolean; verified: boolean };
export type Signature = { name: string; date: string };
export type Dossier = {
  applicationNo: string; date: string; name: string; dob: string; gender: string; mobile: string; email: string; address: string;
  guardian: string; guardianMobile: string; qualifications: Qualification[]; sources: string[]; moreDetails: string;
  course: string; plan: string; instalments: boolean; count: number; documents: Record<string, Attachment>;
  declaration: boolean; studentSignature: Signature; guardianSignature: Signature; counsellorSignature: Signature;
  custom: Record<string, string>; leadId?: string;
};
export type Payment = { id: string; amount: number; date: string; reference: string };
export type Signoff = { signedBy: string; date: string; notes: string };
export type Application = { id: string; studentId: string; dossier: Dossier; submittedAt: string; status: 'Submitted' | 'Corrections Required' | 'Approved'; financeStatus: 'Pending Verification' | 'Corrections Required' | 'Verified'; fee: number; payments: Payment[]; administrator?: Signoff; accountant?: Signoff; correctionNote: string };
export type CustomField = { id: string; label: string; section: number; required: boolean };
export type Config = { courses: { name: string; fee: number }[]; sections: string[]; customFields: CustomField[] };
export type AdmissionsState = { applications: Application[]; students: { id: string; name: string; email: string; mobile: string }[]; config: Config };
export const INITIAL: AdmissionsState = { applications: [], students: [], config: { courses: COURSES.map(name => ({ name, fee: 0 })), sections: SECTIONS, customFields: [] } };
export const today = () => new Date().toISOString().slice(0, 10);
export function ageFromDob(dob: string, date = new Date()) { const age = differenceInYears(date, parseISO(dob)); return Number.isFinite(age) && age >= 0 ? age : 0; }
export function instalmentAmounts(fee: number, count: number): number[] {
  if (!Number.isFinite(fee) || fee < 0 || ![1, 2, 3, 4, 6].includes(count)) return [];
  const cents = Math.round(fee * 100), base = Math.floor(cents / count);
  return Array.from({ length: count }, (_, i) => (base + (i < cents % count ? 1 : 0)) / 100);
}
export function fullyVerified(app: Application) { return Boolean(app.administrator && app.accountant); }
export function balance(app: Application) { return Math.max(0, app.fee - app.payments.reduce((s, p) => s + p.amount, 0)); }
export function canAccountantSign(app: Application) { return app.fee > 0 && (app.dossier.instalments ? app.payments.reduce((s, p) => s + p.amount, 0) >= (instalmentAmounts(app.fee, app.dossier.count)[0] ?? app.fee) : balance(app) === 0); }
export function blankDossier(): Dossier {
  return { applicationNo: `SKILL-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`, date: today(), name: '', dob: '', gender: '', mobile: '', email: '', address: '', guardian: '', guardianMobile: '', qualifications: [{ id: crypto.randomUUID(), role: '', institute: '', year: '', grade: '' }], sources: [], moreDetails: '', course: COURSES[0], plan: PLANS[0], instalments: false, count: 2, documents: {}, declaration: false, studentSignature: { name: '', date: today() }, guardianSignature: { name: '', date: today() }, counsellorSignature: { name: '', date: today() }, custom: {} };
}
export function dossierErrors(d: Dossier, config: Config): string[] {
  const errors: string[] = [];
  for (const [key, label] of [['name', 'Student full name'], ['dob', 'Date of birth'], ['mobile', 'Mobile no'], ['email', 'Email'], ['address', 'Permanent address'], ['guardian', 'Guardian Name & Relation'], ['guardianMobile', 'Guardian mobile no']] as const) if (!d[key].trim()) errors.push(`${label} is required`);
  if (d.dob && (Number.isNaN(parseISO(d.dob).getTime()) || d.dob > today())) errors.push('Enter a valid date of birth');
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.push('Enter a valid email');
  for (const phone of [d.mobile, d.guardianMobile]) if (phone && !/^\+?[\d\s()-]{10,20}$/.test(phone)) errors.push('Enter a valid mobile number');
  if (!config.courses.some(c => c.name === d.course)) errors.push('Select an available course');
  if (d.instalments && ![2,3,4,6].includes(d.count)) errors.push('Choose 2, 3, 4 or 6 instalments');
  if (!d.declaration) errors.push('Accept the declaration');
  if (!d.studentSignature.name || !d.guardianSignature.name || !d.counsellorSignature.name) errors.push('Complete all three signatures');
  for (const f of config.customFields) if (f.required && !d.custom[f.id]?.trim()) errors.push(`${f.label} is required`);
  return errors;
}
export function createApplication(dossier: Dossier, fee: number): Application { return { id: crypto.randomUUID(), studentId: crypto.randomUUID(), dossier, submittedAt: new Date().toISOString(), status: 'Submitted', financeStatus: 'Pending Verification', fee, payments: [], correctionNote: '' }; }
export const money = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
