import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "HR — Manager Edu" },
      { name: "description", content: "Manager Edu hr module for schools." },
      { property: "og:title", content: "HR — Manager Edu" },
      { property: "og:description", content: "Manager Edu hr module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HRPage,
});

function HRPage() {
  return <ModulePage title="HR" stats={[["Employees", "186"], ["On Leave", "7"], ["Open Roles", "5"], ["Payroll", "₹42L"]] as [string, string, string?][]} panels={[{"title": "Leave Requests", "rows": [["Neha Gupta — Sick leave", "Pending"], ["Arjun Iyer — Casual", "Approved"]]}, {"title": "Hiring", "rows": [["Chemistry Teacher", "12 applicants"], ["Accountant", "8 applicants"]]}] as { title: string; rows: [string, string][] }[]} />;
}
