import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Manager Edu" },
      { name: "description", content: "Manager Edu admin module for schools." },
      { property: "og:title", content: "Admin — Manager Edu" },
      { property: "og:description", content: "Manager Edu admin module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return <ModulePage title="Admin" stats={[["Staff", "86"], ["Roles", "12"], ["Departments", "9"], ["Pending approvals", "7"]] as [string, string, string?][]} panels={[{"title": "Access Requests", "rows": [["Anita Rao — Accounts", "Pending"], ["Vikram Nair — Transport", "Approved"], ["Sara Joseph — Library", "Pending"]]}, {"title": "System Tasks", "rows": [["Fee structure update", "Scheduled"], ["Database backup", "Running"], ["Role audit — Term 2", "Draft"]]}] as { title: string; rows: [string, string][] }[]} />;
}
