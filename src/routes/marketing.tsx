import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing — Manager Edu" },
      { name: "description", content: "Manager Edu marketing module for schools." },
      { property: "og:title", content: "Marketing — Manager Edu" },
      { property: "og:description", content: "Manager Edu marketing module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketingPage,
});

function MarketingPage() {
  return <ModulePage title="Marketing" stats={[["Campaigns", "12"], ["Leads", "942", "+18%"], ["Open Rate", "41%"], ["Cost / Lead", "₹210"]] as [string, string, string?][]} panels={[{"title": "Active Campaigns", "rows": [["Admissions 2027 — Social", "Running"], ["Open House Email", "Scheduled"], ["Scholarship Drive", "Draft"]]}, {"title": "Lead Sources", "rows": [["Website", "48%"], ["Referral", "27%"], ["Social Media", "25%"]]}] as { title: string; rows: [string, string][] }[]} />;
}
