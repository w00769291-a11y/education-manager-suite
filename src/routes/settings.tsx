import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Manager Edu" },
      { name: "description", content: "Manager Edu settings module for schools." },
      { property: "og:title", content: "Settings — Manager Edu" },
      { property: "og:description", content: "Manager Edu settings module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <ModulePage title="Settings" stats={[["Users", "238"], ["Roles", "9"], ["Integrations", "4"], ["Branches", "2"]] as [string, string, string?][]} panels={[{"title": "Organization", "rows": [["Institution name", "Manager Edu School"], ["Academic year", "2026-27"], ["Currency", "INR"]]}, {"title": "Security", "rows": [["Two-factor auth", "Enabled"], ["Session timeout", "30 min"]]}] as { title: string; rows: [string, string][] }[]} />;
}
