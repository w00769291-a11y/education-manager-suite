export const CALL_CENTER_PAGES = [
  { to: "/admission/call-center", label: "Overview", exact: true },
  { to: "/admission/call-center/upload", label: "Upload Leads" },
  { to: "/admission/call-center/leads", label: "Assign Leads" },
  { to: "/admission/call-center/my-leads", label: "Agent Leads" },
  { to: "/admission/call-center/agents", label: "Manage Agents" },
  { to: "/admission/call-center/reports", label: "Reports" },
] as const;

export function callCenterHead(page: string, description: string) {
  const title = `${page} — Sales Call Center | Edusphere`;
  return { meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] };
}