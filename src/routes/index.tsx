import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Manager Edu" },
      { name: "description", content: "Manager Edu dashboard module for schools." },
      { property: "og:title", content: "Dashboard — Manager Edu" },
      { property: "og:description", content: "Manager Edu dashboard module for schools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <ModulePage title="Dashboard" stats={[["Total Students", "2,480", "+4.2% this term"], ["Staff", "186"], ["Fees Collected", "₹48.2L", "82% of target"], ["New Enquiries", "134", "This week"]] as [string, string, string?][]} panels={[{"title": "Recent Activity", "rows": [["Fee paid — Aarav S. (Gr 8)", "10 min ago"], ["Admission approved — Diya K.", "1 hr ago"], ["Exam schedule published", "3 hr ago"]]}, {"title": "Upcoming", "rows": [["Parent-teacher meeting", "Nov 4"], ["Mid-term exams", "Nov 12"], ["Annual day", "Dec 18"]]}] as { title: string; rows: [string, string][] }[]} />;
}
